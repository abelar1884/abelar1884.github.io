# Acceptance gates for referral.html
# Scoping rule that matters: the site header, mobile dialog and footer are copied VERBATIM from
# index.html per decision 5. Content gates must therefore run on REFERRAL-AUTHORED PROSE ONLY,
# or they fail on a correct build. Two gates already tripped over this:
#   - 'под капот' is legitimate footer copy ("А рутину мы убрали под капот")
#   - phone number '+7 901 468 23 44' contains ASCII spaces between digits
# Structural gates that should hold document-wide stay document-wide.

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot\..\..\..
$nb = [char]0x00A0
$pass = 0; $fail = 0
function chk($name, $cond) {
  if ($cond) { Write-Host "PASS  $name"; $script:pass++ }
  else       { Write-Host "FAIL  $name" -ForegroundColor Red; $script:fail++ }
}

$h    = Get-Content -Raw -Encoding UTF8 referral.html
$idx  = Get-Content -Raw -Encoding UTF8 index.html
$css  = Get-Content -Raw -Encoding UTF8 css\referral.css
$js   = Get-Content -Raw -Encoding UTF8 js\referral.js

# --- authored region: first unit marker .. </main>  (excludes header, dialog, footer) ---
$start = $h.IndexOf('<!-- ===== 01-hero.html')
$end   = $h.LastIndexOf('</main>')
if ($start -lt 0 -or $end -lt 0) { throw "cannot delimit authored region" }
$body  = $h.Substring($start, $end - $start)
# Phone numbers legitimately use ASCII spaces between digit groups (repo convention: the
# site footer's +7 901 468 23 44 and the mobile support block's +7 (495) 477 11 11).
# Strip tel: anchors before the digit-grouping assertion. THIRD time this gate collided
# with legitimate content, so the carve-out is general rather than per-case.
$bodyNoTel = [regex]::Replace($body, '(?s)<a[^>]*href="tel:[^"]*"[^>]*>.*?</a>', '')
# tag-stripped text of the authored region, for prose assertions
$text  = ($body -replace '<[^>]+>', ' ' -replace '\s+', ' ')

Write-Host "`n=== STRUCTURAL (document-wide) ==="
chk "exactly one <h1>" ([regex]::Matches($h,'<h1[\s>]').Count -eq 1)
$imgs  = [regex]::Matches($h,'<img\b[^>]*>')
$noAlt = @($imgs | Where-Object { $_.Value -notmatch '\salt=' }).Count
chk "every <img> has alt ($($imgs.Count) imgs)" ($noAlt -eq 0)
chk "stylesheet order template -> about -> referral" (
  ($h -match '(?s)template\.css.*about\.css.*referral\.css') )
chk "about.css carries the shared-chrome comment" ($h -match '(?s)<!--[^>]*chrome[^>]*-->\s*<link[^>]*about\.css|about\.css[^>]*>\s*')
# The plan said "copy the hash byte-for-byte from index.html". That turned out to be
# wrong: index.html's hash (sha512-Qrpii3...) no longer matches what cdnjs serves for
# gsap 3.15.0, so the browser blocks the script and js/template.js throws, killing the
# mobile nav. Copying it faithfully would reproduce the bug. The gate therefore asserts
# the hash is VALID, not that it matches a broken reference.
$gsapNew = [regex]::Match($h,'gsap[^>]*integrity="sha512-([^"]+)"').Groups[1].Value
chk "GSAP SRI hash present" ($gsapNew.Length -gt 40)
chk "GSAP SRI hash is NOT index.html's stale one" ($gsapNew -notmatch '^Qrpii3')
chk "template.js loads before referral.js" ($h -match '(?s)js/template\.js.*js/referral\.js')
chk "no about-* classes" (-not ($h -match 'class="[^"]*\babout-'))
chk "no #aeroclub-logo / #about-section-title-expert" (
  ($h -notmatch 'id="aeroclub-logo"') -and ($h -notmatch 'id="about-section-title-expert"') )
chk "no about-faq / js-faq- (about.js collision guard)" ($h -notmatch 'about-faq|js-faq-')
chk "js/about.js NOT loaded" ($h -notmatch 'js/about\.js')

Write-Host "`n=== CALCULATOR (decision REVERSED 2026-08-19: the block is now REQUIRED) ==="
# These five gates originally asserted the calculator was ABSENT, per the initial
# "without second block" instruction. The user later asked for the block to be built,
# so the assertions are inverted rather than deleted — the gate list still encodes the
# current intent, and the history of the reversal stays visible here.
chk "calculator section present"        ($body -match 'referral-calc')
chk "calculator: heading present"       ($body -match 'Рассчитайте')
chk "calculator: slider label present"  ($body -match 'Количество привлеченных клиентов')
chk "calculator: chips label present"   ($body -match 'Размер бизнеса')
chk "calculator: disclaimer present"    ($body -match 'Расчет приведен')
chk "calculator: all four business tiers present" (
  ($body -match 'Малый') -and ($body -match 'Средний') -and
  ($body -match 'Крупный') -and ($body -match 'Холдинг') )
chk "calculator: default figure matches comp (5 x Крупный = 2 500 000)" (
  [regex]::Matches($body,"2$nb" + "500$nb" + "000$nb₽").Count -eq 1 )
chk "calculator: slider is a native range input (keyboard/AT support)" (
  $body -match '<input[^>]*type="range"[^>]*min="1"[^>]*max="100"' )
chk "calculator: chips are real radios in a fieldset (not divs)" (
  ($body -match '<fieldset[^>]*referral-calc__control--size') -and
  ([regex]::Matches($body,'type="radio"[^>]*name="referral-calc-size"').Count -eq 4) )
chk "calculator: result region is aria-live" ($body -match 'referral-calc__result[^>]*aria-live')
chk "calculator: business rates live in ONE named constant" ($js -match 'RATES_PER_CLIENT')
chk "artifact 'под капот' absent from AUTHORED region (it is legitimate footer copy)" (
  $body -notmatch 'под капот' )
chk "rejected partner variant absent" ($body -notmatch 'Руководители, тревел-менеджеры')

Write-Host "`n=== PARTNER-VARIANT DISCRIMINATOR ==="
$h2texts = [regex]::Matches($body,'(?s)<h2[^>]*>(.*?)</h2>') |
  ForEach-Object { ($_.Groups[1].Value -replace '<[^>]+>','' -replace '\s+',' ').Trim() }
$whoCount = @($h2texts | Where-Object { $_ -match 'Кто может стать партнером' }).Count
chk "exactly one h2-level 'Кто может стать партнером' (found $whoCount)" ($whoCount -eq 1)
# anchor inside the referral-who SECTION rather than searching forward from a raw
# string: unit 04's h2 is "Кто может стать <span>партнером?</span>", so the full
# phrase only exists once tags are stripped.
$whoSection = [regex]::Match($body,'(?s)<section[^>]*referral-who.*?</section>').Value
chk "referral-who section exists" ($whoSection.Length -gt 0)
chk "first sub-heading in referral-who is 'Руководители и собственники бизнеса'" (
  ([regex]::Match($whoSection,'(?s)<h3[^>]*>(.*?)</h3>').Groups[1].Value -replace '<[^>]+>','').Trim() -like '*Руководители и собственники бизнеса*' )
$plain  = ($body -replace '<[^>]+>','')
$faqWho = [regex]::Matches($plain,'Кто может стать партнером').Count
chk "'Кто может стать партнером' appears twice total: section h2 + FAQ item (found $faqWho)" (
  $faqWho -eq 2 )

Write-Host "`n=== RUSSIAN TYPOGRAPHY (authored prose only) ==="
# raw $body, not $text: stripping tags inserts spaces between digits, and
# collapsing \s+ destroys U+00A0 (NBSP matches \s in .NET) -> false failures
$asciiDigit = [regex]::Matches($bodyNoTel,'\d \d')
chk "no ASCII space between digits ($($asciiDigit.Count) found)" ($asciiDigit.Count -eq 0)
chk "NBSP present in authored prose" ([regex]::Matches($body,$nb).Count -gt 0)
$rub = [regex]::Matches($body,'.₽')
$badRub = @($rub | Where-Object { $_.Value[0] -ne $nb }).Count
chk "every ₽ preceded by NBSP ($($rub.Count) occurrences, $badRub bad)" ($badRub -eq 0)
chk "no &nbsp; entities (repo uses literal U+00A0)" ($body -notmatch '&nbsp;')

Write-Host "`n=== CSS / JS HYGIENE ==="
chk "referral.css has no @import"  ($css -notmatch '@import')
chk "referral.css has no !important" ($css -notmatch '!important')
chk "referral.css defines the token block" ($css -match '--rf-teal')
chk "body background override present" ($css -match 'body\s*\{[^}]*#f4f4f6')
chk "no leftover display:none on the hero collage" (
  -not ($css -match '(?s)\.referral-hero__collage\s*\{[^}]*display:\s*none') )
# a comment may legitimately mention aria-selected to warn against it; only a real
# setAttribute/property write is a violation
chk "referral.js uses aria-current, never sets aria-selected" (
  ($js -match 'aria-current') -and
  ($js -notmatch 'setAttribute\(\s*[''"]aria-selected') -and ($js -notmatch 'ariaSelected') )
chk "referral.js is IIFE-wrapped (leading comment allowed)" (
  ($js -replace '(?s)/\*.*?\*/','' -replace '(?m)^\s*//.*$','').TrimStart() -match '^(\(function|\(\s*\(\s*\)\s*=>|;\(function|\(async)' )

Write-Host "`n--------------------------------------"
Write-Host "PASS: $pass   FAIL: $fail"
if ($fail -gt 0) { exit 1 } else { exit 0 }
