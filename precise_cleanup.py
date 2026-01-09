import re

files = [
    r"c:\Users\Don\wireless-home\app\solutions\lighting\page.tsx",
    r"c:\Users\Don\wireless-home\app\solutions\curtains\page.tsx",
    r"c:\Users\Don\wireless-home\app\solutions\water\page.tsx",
    r"c:\Users\Don\wireless-home\app\solutions\wifi\page.tsx",
    r"c:\Users\Don\wireless-home\app\solutions\entertainment\page.tsx"
]

def clean_feature_card(card_content):
    """Clean a single feature card"""
    # Remove the group relative bg-gradient class and replace with simple bg-white
    card_content = re.sub(
        r'className="group relative bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl p-8 md:p-10 hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-\w+-500/20"',
        'className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md"',
        card_content
    )
    
    # Remove the absolute blur decoration
    card_content = re.sub(
        r'\s*<div className="absolute top-0 right-0 w-32 h-32 bg-\w+-500/\d+ rounded-full blur-2xl group-hover:bg-\w+-500/\d+ transition-all duration-500" />\s*\n',
        '',
        card_content
    )
    
    # Remove the relative wrapper div (opening)
    card_content = re.sub(
        r'<div className="relative">\s*\n\s*(<div className="w-16)',
        r'\1',
        card_content
    )
    
    # Remove group-hover and transition from icon divs
    card_content = re.sub(
        r' group-hover:scale-110 transition-transform duration-500',
        '',
        card_content
    )
    
    # Remove the closing div for the relative wrapper (before the card close)
    # Pattern: (feature items)</div>\n              </div>\n            </div>
    # Should be: (feature items)</div>\n            </div>
    card_content = re.sub(
        r'(</span>\s*\n\s*</div>)\s*\n\s*</div>(\s*\n\s*</div>)',
        r'\1\2',
        card_content
    )
    
    return card_content

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all feature card sections (grid with 3 cards)
    # Match the entire grid md:grid-cols-3 section
    pattern = r'(<div className="grid md:grid-cols-3 gap-8">.*?</div>\s*</div>\s*</section>)'
    
    def replace_grid(match):
        grid_section = match.group(1)
        # Clean each card in this grid
        cleaned = clean_feature_card(grid_section)
        return cleaned
    
    content = re.sub(pattern, replace_grid, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Precisely cleaned: {filepath}")

print("\nAll files cleaned precisely!")
