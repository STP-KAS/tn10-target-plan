# Registers the Mini's tn10-mini-counter task. Run this on the Mini only.
# The task starts mini-counter.mjs every 5 minutes as the current user.
# It does not restart a node. It publishes only when tn10-mini-counter-state\role.txt says mini.
param(
  [string]$RoleFile
)
$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$script = Join-Path $here "mini-counter.mjs"
if (-not (Test-Path $script)) { throw "mini-counter.mjs is not next to this installer" }
$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) { throw "node is not on PATH" }
$state = Join-Path $env:USERPROFILE "tn10-mini-counter-state"
New-Item -ItemType Directory -Force -Path $state | Out-Null
if ($RoleFile) {
  Set-Content -Path (Join-Path $state "role.txt") -Value "mini" -Encoding ascii
} else {
  $role = Join-Path $state "role.txt"
  if (-not (Test-Path $role) -or (Get-Content $role -Raw).Trim() -ne "mini") {
    throw "refusing to register: role.txt in the counter state folder must say mini"
  }
}
$tr = '"' + $node + '" "' + $script + '"'
$args = @("/Create", "/TN", "tn10-mini-counter", "/SC", "MINUTE", "/MO", "5", "/TR", $tr, "/F")
$p = Start-Process -FilePath schtasks.exe -ArgumentList $args -Wait -PassThru -NoNewWindow
if ($p.ExitCode -ne 0) { throw "schtasks exited $($p.ExitCode)" }
Write-Host "registered tn10-mini-counter"
