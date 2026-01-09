# PowerShell script to clean feature cards

$files = @(
    "c:\Users\Don\wireless-home\app\solutions\lighting\page.tsx",
    "c:\Users\Don\wireless-home\app\solutions\curtains\page.tsx",
    "c:\Users\Don\wireless-home\app\solutions\water\page.tsx",
    "c:\Users\Don\wireless-home\app\solutions\wifi\page.tsx",
    "c:\Users\Don\wireless-home\app\solutions\entertainment\page.tsx"
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    
    # Replace group relative bg-gradient with simple bg-white
    $content = $content -replace 'group relative bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl p-8 md:p-10 hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-\w+-500/20', 'bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md'
    
    # Remove absolute positioned blur decorations (multi-line pattern)
    $content = $content -replace '<div className="absolute top-0 right-0 w-32 h-32 bg-\w+-500/\d+ rounded-full blur-2xl group-hover:bg-\w+-500/\d+ transition-all duration-500" />\s*', ''
    
    # Remove relative div wrappers inside cards
    $content = $content -replace '<div className="relative">\s*\n\s*<div className="w-16', '<div className="w-16'
    
    # Close the removed relative div at the end of card content
    $content = $content -replace '</div>\s*\n\s*</div>\s*\n\s*</div>\s*\n\s*\n\s*<div className="(group|bg-white)', '</div>
            </div>

            <div className="$1'
    
    # Remove group-hover and transition from icon divs
    $content = $content -replace 'group-hover:scale-110 transition-transform duration-500', ''
    
    Set-Content $file $content -NoNewline
    Write-Host "Cleaned $file"
}

Write-Host "All files cleaned!"
