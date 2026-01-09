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
    
    # Fix indentation: cards should start with proper spacing after the previous card closes
    # Replace pattern: </div>\n\n            <div className="bg-white
    # With: </div>\n\n            <div className="bg-white
    
    # Remove extra blank line after card opening
    content = re.sub(
        r'(<div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">)\s*\n\s*\n\s*(<div className="w-16)',
        r'\1\n              \2',
        content
    )
    
    # Ensure proper indentation for card content
    content = re.sub(
        r'(<div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">)\n\s*(<div className="w-16)',
        r'\1\n              \2',
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Polished: {filepath}")

print("\nAll files polished!")
