<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;

class WeightDistribution
{

    public function __construct($weights, $targets)
    {
        $this->weights = $weights;
        $this->targets = $targets;
    }

    public function find_criteria($criteriaId, $subCriteriaId, $subSubCriteriaId)
    {
        $filteredWeights = [];
        for ($i = 0; $i < count($this->weights); $i++) {
            $weight = $this->weights[$i];
            if (
                $weight['CriteriaID'] == $criteriaId &&
                $weight['SubCriteriaID'] == $subCriteriaId &&
                $weight['SubSubCriteriaID'] == $subSubCriteriaId
            ) {
                array_push($filteredWeights, $weight);
            }
        }

        return isset($filteredWeights[0]) ? $filteredWeights[0] : null;
    }

    public function getSiblings($criteriaId, $subCriteriaId, $subSubCriteriaId)
    {
        return array_filter($this->targets, function ($t) use ($criteriaId, $subCriteriaId, $subSubCriteriaId) {
            if ($subSubCriteriaId) {
                return $t['SubCriteriaID'] == $subCriteriaId;
            } else if ($subCriteriaId) {
                return $t['CriteriaID'] == $criteriaId && $t['SubSubCriteriaID'] == NULL;
            }

            return true;
        });
    }

    public function weightDistributedTargets()
    {
        $weightDistributedTargets = [];
        $doneParents = [];
        $tt = [];

        foreach ($this->targets as $target) {
            $criteriaId = $target['CriteriaID'];
            $subCriteriaId = $target['SubCriteriaID'];
            $subSubCriteriaId = $target['SubSubCriteriaID'];

            if ($subSubCriteriaId) {
                $parentKey = $criteriaId . '-' . $subCriteriaId;
            } else if ($subCriteriaId) {
                $parentKey = $criteriaId;
            }

            if (!in_array($parentKey, $doneParents)) {
                $weightTobeDistributed = 0;
                $targetSiblings = $this->getSiblings($criteriaId, $subCriteriaId, $subSubCriteriaId);
                $criteria = $this->find_criteria($criteriaId, $subCriteriaId, $subSubCriteriaId);
                $nonZeroTargets = [];

                foreach ($targetSiblings as $sTarget) {
                    if ((int)$sTarget['Target'] == 0) {
                        $weightTobeDistributed += (int)$criteria['Weight'];
                        $sTarget['Weight'] = 0;
                        array_push($weightDistributedTargets, $sTarget);
                        array_push($tt, $sTarget);
                    } else {
                        array_push($nonZeroTargets, $sTarget);
                    }
                }

                foreach ($nonZeroTargets as $nzt) {
                    $criteria = $this->find_criteria($nzt['CriteriaID'], $nzt['SubCriteriaID'], $nzt['SubSubCriteriaID']);
                    $nzt['Weight'] = (float)$criteria['Weight'] + round($weightTobeDistributed / count($nonZeroTargets), 2);
                    array_push($weightDistributedTargets, $nzt);
                    array_push($tt, $nzt);
                }

                array_push($doneParents, $parentKey);
            }
        }
        return $weightDistributedTargets;
    }
}
