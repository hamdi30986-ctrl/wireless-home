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
    
    # Remove the extra </div> that closes the removed relative div
    # Pattern: (feature list items)</div>\n              </div>\n            </div>\n\n should be
    # Pattern: (feature list items)</div>\n            </div>\n\n
    
    # Match cards with the extra closing div
    content = re.sub(
        r'(</div>\s*\n\s*</div>)\s*\n\s*</div>\s*\n\s*\n\s*<div className="bg-white',
        r'\1\n\n            <div className="bg-white',
        content
    )
    
    # Fix the last card in each grid (before </div>\n</div>\n</section>)
    content = re.sub(
        r'(</div>\s*\n\s*</div>)\s*\n\s*</div>\s*\n\s*</div>\s*\n\s*</div>\s*\n\s*</section>',
        r'\1\n          </div>\n        </div>\n      </section>',
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Final fix applied: {filepath}")

print("\nAll files finalized!")
