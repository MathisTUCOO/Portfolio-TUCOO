$v = ""
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG1_c00.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG1_c01.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG1_c02.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG1_c03.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG1_c04.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG1_c05.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG1_c06.txt" -Raw
$line = "const LOCA_IMG1 = ""data:image/png;base64," + $v + """;"
Add-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\atelier_assets.js" -Value $line
$v = ""
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG2_c00.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG2_c01.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG2_c02.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG2_c03.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG2_c04.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG2_c05.txt" -Raw
$line = "const LOCA_IMG2 = ""data:image/png;base64," + $v + """;"
Add-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\atelier_assets.js" -Value $line
$v = ""
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG3_c00.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG3_c01.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG3_c02.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG3_c03.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG3_c04.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG3_c05.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG3_c06.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG3_c07.txt" -Raw
$line = "const LOCA_IMG3 = ""data:image/png;base64," + $v + """;"
Add-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\atelier_assets.js" -Value $line
$v = ""
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG4_c00.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG4_c01.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG4_c02.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG4_c03.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG4_c04.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG4_c05.txt" -Raw
$line = "const LOCA_IMG4 = ""data:image/png;base64," + $v + """;"
Add-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\atelier_assets.js" -Value $line
$v = ""
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG5_c00.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG5_c01.txt" -Raw
$line = "const LOCA_IMG5 = ""data:image/png;base64," + $v + """;"
Add-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\atelier_assets.js" -Value $line
$v = ""
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG6_c00.txt" -Raw
$v += Get-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG6_c01.txt" -Raw
$line = "const LOCA_IMG6 = ""data:image/png;base64," + $v + """;"
Add-Content -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\atelier_assets.js" -Value $line
Get-ChildItem "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_LOCA_IMG*.txt" | Remove-Item -Force
Remove-Item -Path "C:\Users\mathi\Desktop\Portfolio-TUCOO v2\_assemble_loca.ps1" -Force
Write-Host "Done - All images injected"
