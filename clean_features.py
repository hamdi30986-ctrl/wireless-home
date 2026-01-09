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
    
    # Replace all feature card main divs
    content = re.sub(
        r'className="group relative bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl p-8 md:p-10 hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-\w+-500/20"',
        'className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md"',
        content
    )
    
    # Remove absolute positioned blur decorations
    content = re.sub(
        r'\s*<div className="absolute top-0 right-0 w-32 h-32 bg-\w+-500/\d+ rounded-full blur-2xl group-hover:bg-\w+-500/\d+ transition-all duration-500" />\s*',
        '\n',
        content
    )
    
    # Remove group-hover and transition from icon divs
    content = re.sub(
        r' group-hover:scale-110 transition-transform duration-500',
        '',
        content
    )
    
    # Remove the relative wrapper divs - match the opening
    content = re.sub(
        r'(<div className="(?:bg-white|group)[^"]*">\s*)<div className="relative">\s*\n',
        r'\1\n',
        content
    )
    
    # Remove the closing </div> for relative wrapper (after the inner content but before card close)
    # This is tricky, so we'll target the specific pattern
    content = re.sub(
        r'(</div>\s*</div>)\s*\n\s*(</div>)\s*\n\s*\n\s*(<div className="(?:bg-white|group))',
        r'\1\n\2\n\n\3',
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Cleaned: {filepath}")

print("\nAll files processed!")
