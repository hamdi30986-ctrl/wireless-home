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
    
    # Fix the closing structure with proper indentation
    # Pattern: </div>\n</div>\n          </div>\n</div>\n</section>
    # Should be: </div>\n            </div>\n          </div>\n        </div>\n      </section>
    
    content = re.sub(
        r'(</span>\s*\n\s*</div>)\s*\n</div>\s*\n\s*</div>\s*\n</div>\s*\n</section>',
        r'\1\n            </div>\n          </div>\n        </div>\n      </section>',
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Fixed final structure: {filepath}")

print("\nAll structures fixed!")
