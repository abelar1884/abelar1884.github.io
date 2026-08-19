# Reconcile asset references in the built fragments against the files that actually
# exist on disk. Figma returns whatever format the original upload was, which does not
# always match the extension the SPEC guessed (hero collage came back .png where the
# plan said .jpg; the commission cards did the same). Rather than hand-patch each one,
# this rewrites every reference to the real file, and reports anything still dangling.
#
# Run from the repo root:  python .omc/build/referral/reconcile-assets.py
# Then re-run the assembly step.

import os, re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
ASSET_DIR = os.path.join(REPO, "assets", "images", "referral")
FRAG_DIR = os.path.join(REPO, ".omc", "build", "referral", "sections")

# stem -> actual filename on disk
on_disk = {}
for fn in os.listdir(ASSET_DIR):
    stem, ext = os.path.splitext(fn)
    if ext.lower() in (".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif"):
        on_disk[stem] = fn

ref_re = re.compile(r"assets/images/referral/([A-Za-z0-9._-]+)")

fixed, missing, ok = [], [], 0
for fn in sorted(os.listdir(FRAG_DIR)):
    if not (fn.endswith(".html") or fn.endswith(".css")):
        continue
    path = os.path.join(FRAG_DIR, fn)
    src = open(path, encoding="utf-8").read()
    out = src

    for m in set(ref_re.findall(src)):
        stem, ext = os.path.splitext(m)
        if m in on_disk.values():
            ok += 1
            continue
        if stem in on_disk:                      # same stem, different extension
            out = out.replace("assets/images/referral/" + m,
                              "assets/images/referral/" + on_disk[stem])
            fixed.append((fn, m, on_disk[stem]))
        else:
            missing.append((fn, m))

    if out != src:
        open(path, "w", encoding="utf-8").write(out)

print("=== extension corrections applied ===")
if fixed:
    for f, was, now in sorted(fixed):
        print("  %-22s %s  ->  %s" % (f, was, now))
else:
    print("  none needed")

print("\n=== already correct: %d references ===" % ok)

print("\n=== still missing on disk (will 404) ===")
if missing:
    for f, ref in sorted(set(missing)):
        print("  %-22s %s" % (f, ref))
else:
    print("  none - every referenced asset exists")

# orphans: exported but never referenced
all_refs = set()
for fn in os.listdir(FRAG_DIR):
    if fn.endswith((".html", ".css")):
        all_refs |= set(ref_re.findall(open(os.path.join(FRAG_DIR, fn), encoding="utf-8").read()))
orphans = sorted(set(on_disk.values()) - all_refs)
print("\n=== exported but never referenced ===")
print("  " + (", ".join(orphans) if orphans else "none"))

sys.exit(1 if missing else 0)
