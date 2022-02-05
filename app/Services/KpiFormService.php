<?php

namespace App\Services;

use App\Models\MonthPlan;

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
          $singleCriteriaArr = [
            'Name' => $singleCriteria->subSubCriteria ? $singleCriteria->subSubCriteria->name : $singleCriteria->subCriteria->Name,
            'Weight' => (float)$singleCriteria->Weight,
            'Target' => (float)$singleCriteria->Target,
            'Actual' => (float)$singleCriteria->Actual,
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

            $ssc['Name'] = $criteriaDetails->Name;
            $ssc['Weight'] = (float)$subSubCriteria['Weight'];
            $ssc['Target'] = (float)$subSubCriteria['Target'];
            $ssc['Actual'] = (float)$subSubCriteria['Actual'];
            $ssc['Unit'] = $subSubCriteria['Unit'];
            array_push($formattedTargets, $ssc);

            $curSCTotalWeight += (float)$subSubCriteria['Weight'];
            $curSCTotalTarget += (float)$subSubCriteria['Target'];
            $curSCTotalActual += (float)$subSubCriteria['Actual'];

            if ($subSubIteration == $subSubCriterias->count()) {
              array_push($formattedTargets, [
                'Name' => $subSubCriteria->subCriteria->Name,
                'Weight' => $curSCTotalWeight,
                'Target' => $curSCTotalTarget,
                'Actual' => $curSCTotalActual,
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

    //dd($monthPlan->approvals[0]->user);

    return [
      'plan' => $monthPlan,
      'targets' => $formattedTargets,
      'user' => $user,
      'remarks' => $monthPlan->actualRemarks,
      'comments' => $monthPlan->comments,
      'approvals' => $monthPlan->approvals
    ];
  }
}
