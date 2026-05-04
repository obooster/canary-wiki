$json = Get-Content "C:\Users\Booster\Downloads\items.json" -Raw | ConvertFrom-Json
$search = "PERFEICAO"
foreach ($cat in $json.items.PSObject.Properties.Name) {
    foreach ($item in $json.items.$cat.PSObject.Properties.Name) {
        if ($item -match $search) {
            Write-Host "$item"
        }
    }
}