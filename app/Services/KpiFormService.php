<?php

namespace App\Services;

use App\Models\MonthPlan;
use Error;
use Exception;

class KpiFormService
{
    public static function formatDataForKpiForm($monthPlanId)
    {
        $monthPlan = MonthPlan::with(
            'user',
            'targets.criteria',
            'approvals.user',
            'targets.subCriteria',
            'targets.subSubCriteria'
        )->find($monthPlanId);
        $user = $monthPlan->user;
        $criterias = $monthPlan->targets->groupBy(['criteria.Name', 'subCriteria.Name']);

        $curCName = "";
        $curSCTotalWeight = 0;
        $curSCTotalTarget = 0;
        $curSCTotalActual = 0;

        $totalTarget = 0;
        $totalActual = 0;
        $totalWeight = 0;
        $totalScore = 0;
        $totalFScore = 0;

        $score = 0;

        function calculateScore($actual, $target, $weight)
        {
            if ($target == 0) return 0;
            try {
                $score = ($actual / $target) * $weight;
                return round($score, 2);
            } catch (Error $e) {
                return 0;
            }
        }

        function calculateFScore($weight, $score)
        {
            try {
                return min($weight, $score);
            } catch (Error $e) {
                return 0;
            }
        }

        $formattedTargets = [];

        foreach ($criterias as $cName => $subCriterias) {
            $rowSpan = 0;
            foreach ($subCriterias as $scName => $subSubCriterias) {
                $curSCTotalActual = 0;
                $curSCTotalWeight = 0;
                $curSCTotalTarget = 0;
                $rowSpan += $subSubCriterias->count();
                $subSubIteration = 0;

                if ($subSubCriterias->count() < 2) {
                    $singleCriteria = $subSubCriterias[0];
                    $score = calculateScore(
                        (float)$singleCriteria['Actual'],
                        (float)$singleCriteria['Target'],
                        (float)$singleCriteria['Weight']
                    );
                    $fScore = calculateFScore((float)$singleCriteria['Weight'], $score);

                    $totalTarget += (float)$singleCriteria->Target;
                    $totalActual += (float)$singleCriteria->Actual;
                    $totalWeight += (float)$singleCriteria->Weight;

                    $totalScore += $score;
                    $totalFScore += $fScore;

                    $singleCriteriaArr = [
                        'Name' => $singleCriteria->subSubCriteria ? $singleCriteria->subSubCriteria->name : $singleCriteria->subCriteria->Name,
                        'Weight' => (float)$singleCriteria->Weight,
                        'Target' => (float)$singleCriteria->Target,
                        'Actual' => (float)$singleCriteria->Actual,
                        'Score' => $score,
                        'FScore' => $fScore,
                        'ChangedBySupervisor' => (int)$singleCriteria->ChangedBySupervisor == 1 ? true : false,
                        'Unit' => $singleCriteria->Unit
                    ];
                    if ($curCName !== $cName) {
                        $singleCriteriaArr['CriteriaName'] = $cName;
                        $curCName = $cName;
                    }
                    array_push($formattedTargets, $singleCriteriaArr);
                } else {
                    foreach ($subSubCriterias as $subSubCriteria) {
                        $subSubIteration++;
                        $criteriaDetails = $subSubCriteria->subSubCriteria ?: $subSubCriteria->subCriteria;
                        $ssc = [];
                        if ($curCName !== $cName) {
                            $ssc['CriteriaName'] = $cName;
                            $curCName = $cName;
                        }

                        $score = calculateScore(
                            (float)$subSubCriteria['Actual'],
                            (float)$subSubCriteria['Target'],
                            (float)$subSubCriteria['Weight']
                        );
                        $fScore = calculateFScore((float)$subSubCriteria['Weight'], $score);

                        $totalTarget += (float)$subSubCriteria->Target;
                        $totalActual += (float)$subSubCriteria->Actual;
                        $totalWeight += (float)$subSubCriteria->Weight;

                        $totalScore += $score;
                        $totalFScore += $fScore;

                        $ssc['Name'] = $criteriaDetails->Name;
                        $ssc['Weight'] = (float)$subSubCriteria['Weight'];
                        $ssc['Target'] = (float)$subSubCriteria['Target'];
                        $ssc['Actual'] = (float)$subSubCriteria['Actual'];
                        $ssc['Score'] = $score;
                        $ssc['FScore'] = $fScore;
                        $ssc['ChangedBySupervisor'] = (int)$subSubCriteria->ChangedBySupervisor == 1 ? true : false;
                        $ssc['Unit'] = $subSubCriteria['Unit'];
                        array_push($formattedTargets, $ssc);

                        $curSCTotalWeight += (float)$subSubCriteria['Weight'];
                        $curSCTotalTarget += (float)$subSubCriteria['Target'];
                        $curSCTotalActual += (float)$subSubCriteria['Actual'];

                        if ($subSubIteration == $subSubCriterias->count()) {
                            $score = calculateScore(
                                $curSCTotalActual,
                                $curSCTotalTarget,
                                $curSCTotalWeight
                            );
                            $fScore = calculateFScore($curSCTotalWeight, $score);

                            array_push($formattedTargets, [
                                'Name' => $subSubCriteria->subCriteria->Name,
                                'Weight' => $curSCTotalWeight,
                                'Target' => $curSCTotalTarget,
                                'Actual' => $curSCTotalActual,
                                'Score' => $score,
                                'FScore' => $fScore,
                                'SumRow' => true
                            ]);

                            $rowSpan += 1;
                        }
                    }
                }
            }

            for ($i = 0; $i < count($formattedTargets); $i++) {
                $fTarget = $formattedTargets[$i];

                if ((isset($fTarget['CriteriaName']) && $fTarget['CriteriaName'] == $cName)) {
                    $formattedTargets[$i]['RowSpan'] = $rowSpan;
                }
            }
        }

        $total = [
            'Target' => $totalTarget,
            'Actual' => $totalActual,
            'Weight' => $totalWeight,
            'Score' => $totalScore,
            'FScore' => $totalFScore
        ];

        return [
            'plan' => $monthPlan,
            'targets' => $formattedTargets,
            'user' => $user,
            'remarks' => $monthPlan->actualRemarks,
            'comments' => $monthPlan->comments,
            'approvals' => $monthPlan->approvals,
            'total' => $total
        ];
    }
}
