// Font Loading Script
document.addEventListener('DOMContentLoaded', function() {
  // Add the loading class to the document
  document.documentElement.classList.add('fonts-loading');
  
  // Add the loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'font-loading-indicator';
  document.body.appendChild(loadingIndicator);
  
  // Function to clean up when fonts are loaded
  function finishFontLoading() {
    document.documentElement.classList.remove('fonts-loading');
    document.documentElement.classList.add('fonts-loaded');
    
    // Explicitly remove the loading indicator from the DOM
    if (loadingIndicator && loadingIndicator.parentNode) {
      loadingIndicator.parentNode.removeChild(loadingIndicator);
    }
    
    console.log('All fonts have been loaded!');
  }
  
  // Use the CSS Font Loading API if available
  if ('fonts' in document) {
    // Define the font we want to load
    const notoSansBengali = [
      new FontFace('Noto Sans Bengali', 'url(https://fonts.gstatic.com/s/notosansbengali/v21/Cn-SJsCGWQxOjaGwMQ6fIiMywrNJIky6nvd8.woff2) format("woff2")', { weight: '400' }),
      new FontFace('Noto Sans Bengali', 'url(https://fonts.gstatic.com/s/notosansbengali/v21/Cn-SJsCGWQxOjaGwMQ6fIiMywrNJIky6nvd8.woff2) format("woff2")', { weight: '600' }),
      new FontFace('Noto Sans Bengali', 'url(https://fonts.gstatic.com/s/notosansbengali/v21/Cn-SJsCGWQxOjaGwMQ6fIiMywrNJIky6nvd8.woff2) format("woff2")', { weight: '700' })
    ];
    
    // Load all font variants
    Promise.all(notoSansBengali.map(font => font.load()))
      .then(loadedFonts => {
        // Add fonts to document
        loadedFonts.forEach(font => {
          document.fonts.add(font);
        });
        
        // When fonts are loaded, change the class
        setTimeout(finishFontLoading, 50); // Small delay to ensure fonts are applied
      })
      .catch(error => {
        console.error('Error loading fonts:', error);
        // On error, remove loading class to show content with fallback font
        document.documentElement.classList.remove('fonts-loading');
        document.documentElement.classList.add('fonts-error');
        
        // Also remove the loading indicator
        if (loadingIndicator && loadingIndicator.parentNode) {
          loadingIndicator.parentNode.removeChild(loadingIndicator);
        }
      });
  } else {
    // For browsers that don't support the Font Loading API
    // Use a timeout as a fallback method
    setTimeout(finishFontLoading, 2000); // Wait 2 seconds and assume fonts loaded
  }
}); 