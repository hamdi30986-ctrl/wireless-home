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
    
    # Remove the extra closing </div> after the feature check items
    # Pattern: </span>\n                </div>\n              </div>\n            </div>
    # Should be: </span>\n                </div>\n            </div>
    
    content = re.sub(
        r'(</span>\s*\n\s*</div>)\s*\n\s*</div>\s*\n\s*(</div>)',
        r'\1\n\2',
        content
    )
    
    # Fix indentation after removal
    content = re.sub(
        r'(</span>\s*\n\s*</div>)\s*\n\s*(</div>)\s*\n\s*\n\s*({/\*|\<div className="bg-white)',
        r'\1\n\2\n\n            \3',
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Removed extra closing divs: {filepath}")

print("\nAll extra divs removed!")
