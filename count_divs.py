filepath = r"c:\Users\Don\wireless-home\app\solutions\lighting\page.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

open_count = 0
for i, line in enumerate(lines, 1):
    open_count += line.count('<div')
    open_count -= line.count('</div>')
    if i in [117, 182, 245]:
        print(f"Line {i}: balance={open_count}, content={line.strip()[:80]}")

print(f"\nFinal balance: {open_count} (should be 0)")
