# One-off: trims white margins from the main logo and saves an ASCII-safe copy.
Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\Asus\BTF CORP\public\brand\btf main logo.png"
$outPath = "c:\Users\Asus\BTF CORP\public\brand\btf-main-logo.png"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
try {
  $minX = $src.Width; $minY = $src.Height; $maxX = 0; $maxY = 0
  for ($y = 0; $y -lt $src.Height; $y += 2) {
    for ($x = 0; $x -lt $src.Width; $x += 2) {
      $p = $src.GetPixel($x, $y)
      if ($p.A -gt 16 -and -not (($p.R -gt 244) -and ($p.G -gt 244) -and ($p.B -gt 244))) {
        if ($x -lt $minX) { $minX = $x }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }

  if ($maxX -le $minX -or $maxY -le $minY) { throw "No content bounds found" }

  $pad = [int]([Math]::Round(($maxX - $minX) * 0.04))
  $cx = [Math]::Max(0, $minX - $pad)
  $cy = [Math]::Max(0, $minY - $pad)
  $cw = [Math]::Min($src.Width - $cx, ($maxX - $minX) + 2 * $pad)
  $ch = [Math]::Min($src.Height - $cy, ($maxY - $minY) + 2 * $pad)

  $rect = New-Object System.Drawing.Rectangle($cx, $cy, $cw, $ch)
  $cropped = $src.Clone($rect, $src.PixelFormat)
  try {
    $cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  } finally {
    $cropped.Dispose()
  }

  Write-Output ("source: {0}x{1}" -f $src.Width, $src.Height)
  Write-Output ("cropped: {0}x{1} at ({2},{3})" -f $cw, $ch, $cx, $cy)
} finally {
  $src.Dispose()
}
