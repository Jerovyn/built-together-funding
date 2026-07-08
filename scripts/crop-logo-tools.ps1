# One-off: crops the tools icon (top portion, above the wordmark) from the trimmed logo.
Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\Asus\BTF CORP\public\brand\btf-main-logo.png"
$outPath = "c:\Users\Asus\BTF CORP\public\brand\btf-logo-tools.png"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
try {
  # Wordmark sits in the bottom ~22% of the trimmed logo; keep the tools above it.
  $h = [int]([Math]::Round($src.Height * 0.76))
  $rect = New-Object System.Drawing.Rectangle(0, 0, $src.Width, $h)
  $cropped = $src.Clone($rect, $src.PixelFormat)
  try {
    $cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  } finally {
    $cropped.Dispose()
  }
  Write-Output ("tools crop: {0}x{1}" -f $src.Width, $h)
} finally {
  $src.Dispose()
}
