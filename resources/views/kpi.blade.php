<html>

<head>
    <style>
        .kpi-container {
            width: 60vw;
            max-width: 900px;
            margin: 0 auto;
        }

        .kpi-header-row {
            display: flex;
            width: 100%;
        }

        .kpi-header-row span {
            min-width: 300px;
            flex: 1;
            font-size: 18px;
        }

    </style>
</head>

<body>
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
            <div class="kpi-header-row">

            </div>
        </div>
        <div class="kpi-table">
            @foreach ($targets as $target)

            @endforeach
        </div>
    </div>
</body>

</html>
