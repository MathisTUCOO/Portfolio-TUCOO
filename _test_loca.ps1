$v = ""
$v += "test_only"
$line = "// LOCA_TEST = " + $v + ";"
Add-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\atelier_assets.js" -Value $line
Write-Host "Script OK"
