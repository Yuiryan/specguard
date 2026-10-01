$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repoRoot
$account = gh api user --jq .login
if ($LASTEXITCODE -ne 0 -or $account -ne 'Yuiryan') {
    throw 'Please run gh auth login and choose Yuiryan first. No repository was published.'
}
if (-not (Test-Path -LiteralPath (Join-Path $repoRoot '.git'))) { throw 'Initialize and review this local repository before publishing.' }
if ((git status --porcelain).Length -gt 0) { throw 'Review and commit pending changes before publishing.' }
gh repo create Yuiryan/specguard --public --source . --remote origin --push --description 'SpecGuard: rà soát yêu cầu phần mềm, offline demo, V1-V2 evals và hồ sơ 12 mục capstone'
if ($LASTEXITCODE -ne 0) { throw 'Publishing failed. Inspect existing repository and remote; do not force-push.' }
gh repo view Yuiryan/specguard --json url,visibility,defaultBranchRef
