<html>

<head>
    <style>
        .kpi-container {
            width: 60vw;
            max-width: 1100px;
            margin: 0 auto;
            padding-top: 20px;
            font-family: sans-serif;
        }

        .kpi-header-row {

            width: 100%;
        }

        .kpi-header-row span {
            min-width: 300px;
            flex: 1;
            font-size: 18px;
        }

        .kpi-table {
            width: 100%;
        }

        .kpi-table table {
            width: 100%;
        }

        .kpi-header-row {
            margin-bottom: 15px;
        }

        .kpi-header-row span {
            font-size: 18px;
            font-weight: bold;
        }

        .kpi-name {
            padding: 10px 0;
        }

        .value-cell {
            text-align: center;
        }

        .odd-row {
            background: rgb(207, 237, 237);
        }

        .even-row {
            background: rgb(228, 225, 241);
        }

        .font-bold {
            font-weight: 700;
        }

        .signature-panel {}

        .signature-panel .signature {
            width: 120px;
            padding: 15px;
        }

        .altered-row {
            background: yellow;
        }

    </style>
</head>

<body>
    @php
        $parentRowClass = '';
    @endphp
    <div class="kpi-container">
        <div class="kpi-header">
            <div class="kpi-header-row">
                <span>
                    <b>Staff ID: {{ $user->UserID }}</b>
                </span>
                <span>
                    <b>Name: {{ $user->UserName }}</b>
                </span>
                <span>
                    <b>Period: {{ $plan->Period }}</b>
                </span>
            </div>
            <br>
            <div class="kpi-header-row">
                <span>
                    <b>Phone: {{ $user->Phone }}</b>
                </span>
                <span>
                    <b>Portfolio: {{ $user->Portfolio }}</b>
                </span>
                <span>
                    <b>Location: {{ $user->Location }}</b>
                </span>
            </div>
        </div>
        <div class="kpi-table">
            <table>
                <tr>
                    <th>Criteria</th>
                    <th>Sub criteria</th>
                    <th>Target</th>
                    <th>Actual</th>
                    <th>Weight</th>
                    <th>Score</th>
                    <th>F.Score</th>
                </tr>
                @foreach ($targets as $target)
                    <tr class="kpi-row @if ($loop->index % 2 == 0) even-row @else odd-row @endif @if (isset($target['SumRow'])) font-bold @endif @if (isset($target['ChangedBySupervisor']) && $target['ChangedBySupervisor']) altered-row @endif">
                        @if (isset($target['CriteriaName']))
                            @php
                                $parentRowClass = $loop->index % 2 == 0 ? 'even-row' : 'odd-row';
                            @endphp
                            {{-- <td @if (isset($target['RowSpan'])) rowspan="{{ $target['RowSpan'] }}" @endif>{{ $target['CriteriaName'] }}</td> --}}
                            <td class="@if ($loop->index % 2 == 0) even-row @else odd-row @endif">{{ $target['CriteriaName'] }}</td>
                        @else
                            <td class="kpi-row {{ $parentRowClass }}">

                            </td>
                        @endif
                        <td class="kpi-name">{{ $target['Name'] }}</td>
                        <td class="value-cell">{{ $target['Target'] }}</td>
                        <td class="value-cell">{{ $target['Actual'] }}</td>
                        <td class="value-cell">{{ $target['Weight'] }}</td>
                        <td class="value-cell">{{ $target['Score'] }}</td>
                        <td class="value-cell">{{ $target['FScore'] }}</td>
                    </tr>
                @endforeach
                <tr>
                    <td></td>
                    <td></td>
                    <td class="value-cell">{{ $total['Target'] }}</td>
                    <td class="value-cell">{{ $total['Actual'] }}</td>
                    <td class="value-cell">{{ $total['Weight'] }}</td>
                    <td class="value-cell">{{ $total['Score'] }}</td>
                    <td class="value-cell">{{ $total['FScore'] }}</td>
                </tr>
            </table>
        </div>
        <h3>Remarks: </h3>
        @foreach ($remarks as $remark)
            <div>
                <span>
                    <b>{{ $loop->index }}. </b><i>{{ $remark->Remarks }}</i>
                </span>
            </div>
        @endforeach
        <h3>Comments: </h3>
        @foreach ($comments as $comment)
            <div>
                <span>
                    <b>{{ $loop->index }}.</b><i>{{ $comment->Comment }}</i>
                </span>
            </div>
        @endforeach
        <h3>Approvals:</h3>
        <div class="signature-panel">
            @foreach ($approvals as $approval)
                <div class="signature">
                    <img style="width: 100%" src="https://app.acibd.com/motors_kpi/{{ $approval->user->Signature }}">
                    <div>
                        <b>{{ $approval->user->UserName }}</b>
                    </div>
                    <div>
                        {{ $approval->user->designation->Designation }}
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</body>

</html>
