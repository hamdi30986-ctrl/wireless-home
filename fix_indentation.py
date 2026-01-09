import re

files = [
    r"c:\Users\Don\wireless-home\app\solutions\lighting\page.tsx",
    r"c:\Users\Don\wireless-home\app\solutions\curtains\page.tsx",
    r"c:\Users\Don\wireless-home\app\solutions\water\page.tsx",
    r"c:\Users\Don\wireless-home\app\solutions\wifi\page.tsx",
    r"c:\Users\Don\wireless-home\app\solutions\entertainment\page.tsx"
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix the closing div alignment for cards
    # Pattern: </span>\n                </div>\n</div>
    # Should be: </span>\n                </div>\n            </div>
    
    content = re.sub(
        r'(</span>\s*\n\s*</div>)\s*\n</div>',
        r'\1\n            </div>',
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Fixed indentation: {filepath}")

print("\nAll indentation fixed!")
