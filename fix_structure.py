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
    
    # Fix the structure: remove extra </div> after card content and before next card
    # Pattern: </div>\n</div>\n\n<div className="bg-white
    # Should be: </div>\n</div>\n\n<div className="bg-white
    
    # But we need to remove the relative wrapper properly
    # Find pattern: <div className="bg-white...>\n\n<div className="w-16 (no relative div)
    # And ensure proper closing
    
    # First, let's fix the orphaned </div> before new cards
    content = re.sub(
        r'</div>\s*\n\s*</div>\s*\n\s*\n\s*<div className="bg-white',
        '</div>\n            </div>\n\n            <div className="bg-white',
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Fixed structure: {filepath}")

print("\nAll files fixed!")
