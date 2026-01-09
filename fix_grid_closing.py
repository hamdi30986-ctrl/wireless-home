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
    
    # Find the pattern where the last card closes but the grid doesn't
    # Pattern: (last card content)</div>\n            </div>\n        </div>\n      </section>
    # Should be: (last card content)</div>\n            </div>\n          </div>\n        </div>\n      </section>
    
    # Fix by adding the missing </div> for the grid
    content = re.sub(
        r'(</span>\s*\n\s*</div>)\s*\n\s*(</div>)\s*\n\s*(</div>)\s*\n\s*(</section>)',
        r'\1\n\2\n          </div>\n\3\n\4',
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Fixed grid closing: {filepath}")

print("\nAll grid closings fixed!")
