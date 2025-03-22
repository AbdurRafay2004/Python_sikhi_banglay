document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const themeToggle = document.getElementById('theme-toggle');
    const links = sidebar.querySelectorAll('a');
    const body = document.body;
    const html = document.documentElement;
  
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    body.appendChild(overlay);
  
    // Toggle sidebar, hamburger icon, and overlay on click
    menuToggle.addEventListener('click', function() {
      const menuToggle = this;
      const sidebar = document.getElementById('sidebar');
      
      // Toggle classes for menu button, sidebar and body
      menuToggle.classList.toggle('active');
      sidebar.classList.toggle('active');
      body.classList.toggle('sidebar-open');
      
      // Toggle overlay
      const overlay = document.querySelector('.overlay');
      if (overlay) {
        overlay.classList.toggle('active');
      }
    });
  
    // Close sidebar when overlay is clicked
    overlay.addEventListener('click', function() {
      const menuToggle = document.getElementById('menu-toggle');
      const sidebar = document.getElementById('sidebar');
      
      document.body.classList.remove('sidebar-open');
      if (menuToggle) menuToggle.classList.remove('active');
      if (sidebar) sidebar.classList.remove('active');
      this.classList.remove('active');
    });
  
    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      updateThemeIcon(newTheme);
    });
  
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      html.setAttribute('data-theme', savedTheme);
      updateThemeIcon(savedTheme);
    }
  
    // Highlight current page in sidebar
    const currentUrl = window.location.href;
    links.forEach(link => {
      if (link.href === currentUrl) {
        link.classList.add('active');
      }
    });
  
    // Close sidebar when a link is clicked on mobile
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          menuToggle.classList.remove('active');
          sidebar.classList.remove('active');
          overlay.classList.remove('active');
          body.classList.remove('menu-open');
        }
      });
    });
  
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        overlay.classList.remove('active');
      }
    });
  
    // Register Service Worker for offline capabilities
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // Determine the location of the service worker relative to the current page
        const swUrl = new URL('js/sw.js', window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/'));
        
        navigator.serviceWorker.register(swUrl)
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(error => {
            console.log('ServiceWorker registration failed: ', error);
          });
      });
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput && searchResults) {
      // Define lesson data for search
      const lessons = [
        {
          title: 'পাঠ ১: Python পরিচিতি',
          description: 'Python কি, কিভাবে ইনস্টল করবেন, এবং প্রথম প্রোগ্রাম লিখবেন',
          url: 'lesson1.html',
          keywords: ['পাইথন', 'শুরু', 'ইনস্টল', 'পরিচিতি', 'প্রোগ্রাম']
        },
        {
          title: 'পাঠ ২: ভেরিয়েবল এবং ডেটা টাইপ',
          description: 'Python-এ ভেরিয়েবল, ডেটা টাইপ এবং অপারেটরস',
          url: 'lesson2.html',
          keywords: ['ভেরিয়েবল', 'ডেটা টাইপ', 'স্ট্রিং', 'নাম্বার', 'লিস্ট', 'অপারেটর']
        },
        {
          title: 'পাঠ ৩: কন্ট্রোল স্ট্রাকচার',
          description: 'if-else স্টেটমেন্ট, লুপ এবং ফাংশন',
          url: 'lesson3.html',
          keywords: ['if-else', 'লুপ', 'ফাংশন', 'কন্ডিশন', 'while', 'for']
        }
      ];
      
      // Handle search input
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query.length < 2) {
          searchResults.classList.remove('active');
          searchResults.innerHTML = '';
          return;
        }
        
        // Find matching lessons
        const matchedLessons = lessons.filter(lesson => {
          const titleMatch = lesson.title.toLowerCase().includes(query);
          const descMatch = lesson.description.toLowerCase().includes(query);
          const keywordMatch = lesson.keywords.some(keyword => 
            keyword.toLowerCase().includes(query)
          );
          
          return titleMatch || descMatch || keywordMatch;
        });
        
        // Display results
        if (matchedLessons.length > 0) {
          searchResults.innerHTML = matchedLessons.map(lesson => `
            <a href="${lesson.url}" class="result-item">
              <h4 class="result-title">${highlightMatch(lesson.title, query)}</h4>
              <p class="result-description">${lesson.description}</p>
            </a>
          `).join('');
        } else {
          searchResults.innerHTML = `
            <div class="no-results">
              <p>কোন ফলাফল পাওয়া যায়নি</p>
            </div>
          `;
        }
        
        searchResults.classList.add('active');
      });
      
      // Function to highlight matching text
      function highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
      }
      
      // Hide search results when clicking outside
      document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
          searchResults.classList.remove('active');
        }
      });
      
      // Clear and hide search results when pressing Escape
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          searchInput.value = '';
          searchResults.classList.remove('active');
        }
      });
    }
    
    // Progress tracking system
    const progressTracker = {
      // Array of lesson ids
      lessonIds: ['lesson1', 'lesson2', 'lesson3', 'lesson4', 'lesson5'],
      
      // Get progress from localStorage
      getProgress: function() {
        const savedProgress = localStorage.getItem('lessonProgress');
        return savedProgress ? JSON.parse(savedProgress) : {};
      },
      
      // Save progress to localStorage
      saveProgress: function(progress) {
        localStorage.setItem('lessonProgress', JSON.stringify(progress));
      },
      
      // Mark a lesson as completed
      markAsCompleted: function(lessonId) {
        const progress = this.getProgress();
        progress[lessonId] = true;
        this.saveProgress(progress);
        this.updateUI();
      },
      
      // Mark a lesson as not completed
      markAsNotCompleted: function(lessonId) {
        const progress = this.getProgress();
        delete progress[lessonId];
        this.saveProgress(progress);
        this.updateUI();
      },
      
      // Check if a lesson is completed
      isCompleted: function(lessonId) {
        const progress = this.getProgress();
        return !!progress[lessonId];
      },
      
      // Get completion percentage
      getCompletionPercentage: function() {
        const progress = this.getProgress();
        const completedCount = Object.keys(progress).length;
        return Math.round((completedCount / this.lessonIds.length) * 100);
      },
      
      // Update UI based on progress
      updateUI: function() {
        // Update sidebar lesson links with completion status
        this.lessonIds.forEach(lessonId => {
          const linkElement = document.querySelector(`a[href="pages/${lessonId}.html"], a[href="${lessonId}.html"]`);
          if (linkElement) {
            if (this.isCompleted(lessonId)) {
              linkElement.classList.add('completed');
              if (!linkElement.querySelector('.completion-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'completion-indicator';
                indicator.innerHTML = '✓';
                linkElement.appendChild(indicator);
              }
            } else {
              linkElement.classList.remove('completed');
              const indicator = linkElement.querySelector('.completion-indicator');
              if (indicator) {
                indicator.remove();
              }
            }
          }
          
          // Update lesson cards on homepage
          const lessonCard = document.querySelector(`.lesson-card[href="pages/${lessonId}.html"], .lesson-card#${lessonId}`);
          if (lessonCard) {
            if (this.isCompleted(lessonId)) {
              lessonCard.classList.add('completed');
              if (!lessonCard.querySelector('.card-completion-indicator')) {
                const cardIndicator = document.createElement('span');
                cardIndicator.className = 'card-completion-indicator';
                cardIndicator.innerHTML = '✓ সম্পন্ন';
                lessonCard.appendChild(cardIndicator);
              }
            } else {
              lessonCard.classList.remove('completed');
              const cardIndicator = lessonCard.querySelector('.card-completion-indicator');
              if (cardIndicator) {
                cardIndicator.remove();
              }
            }
          }
        });
        
        // Update progress bar if it exists
        const progressBar = document.querySelector('.progress-bar');
        const progressPercentage = document.getElementById('progress-percentage');
        if (progressBar && progressPercentage) {
          const percentage = this.getCompletionPercentage();
          progressBar.style.width = `${percentage}%`;
          progressPercentage.textContent = `${percentage}%`;
        }
      },
      
      // Initialize progress tracking
      init: function() {
        // Add completion buttons to lesson pages
        const lessonContent = document.querySelector('.lesson-content');
        const lessonNavigation = document.querySelector('.lesson-navigation');
        
        if (lessonContent && lessonNavigation) {
          // Get current lesson ID from URL
          const path = window.location.pathname;
          const filename = path.substring(path.lastIndexOf('/') + 1);
          const lessonId = filename.replace('.html', '');
          
          if (this.lessonIds.includes(lessonId)) {
            // Create toggle completion button
            const completionButton = document.createElement('button');
            completionButton.id = 'toggle-completion';
            completionButton.className = 'button completion-button';
            
            // Set initial state based on completion status
            if (this.isCompleted(lessonId)) {
              completionButton.classList.add('completed');
              completionButton.innerHTML = 'পাঠটি সম্পন্ন হয়েছে ✓';
            } else {
              completionButton.innerHTML = 'পাঠটি সম্পন্ন করুন';
            }
            
            // Add click event to toggle completion status
            completionButton.addEventListener('click', () => {
              if (this.isCompleted(lessonId)) {
                this.markAsNotCompleted(lessonId);
                completionButton.classList.remove('completed');
                completionButton.innerHTML = 'পাঠটি সম্পন্ন করুন';
              } else {
                this.markAsCompleted(lessonId);
                completionButton.classList.add('completed');
                completionButton.innerHTML = 'পাঠটি সম্পন্ন হয়েছে ✓';
              }
            });
            
            // Insert the button before the navigation links
            lessonNavigation.insertBefore(completionButton, lessonNavigation.firstChild);
          }
        }
        
        // Initialize UI
        this.updateUI();
      }
    };
    
    // Initialize progress tracker
    progressTracker.init();

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
      // Check if sidebar is open and if click is outside the sidebar
      if (document.body.classList.contains('sidebar-open') && 
          !event.target.closest('#sidebar') && 
          !event.target.closest('#menu-toggle')) {
        document.body.classList.remove('sidebar-open');
      }
    });

    function updateThemeIcon(theme) {
      themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
    
    // Network status indicator
    const networkStatus = document.getElementById('network-status');
    if (networkStatus) {
      const statusIcon = networkStatus.querySelector('.status-icon');
      const statusText = networkStatus.querySelector('.status-text');
      
      function updateNetworkStatus() {
        if (navigator.onLine) {
          networkStatus.classList.remove('offline');
          statusIcon.textContent = '✅';
          
          // Special message for offline.html page
          if (window.location.href.includes('offline.html')) {
            statusText.textContent = 'আপনি অনলাইন আছেন - পুনরায় লোড করার চেষ্টা করুন';
            networkStatus.classList.add('visible');
          } else {
            statusText.textContent = 'আপনি অনলাইন আছেন';
            networkStatus.classList.add('visible');
            
            // Hide after 3 seconds on regular pages
            setTimeout(() => {
              networkStatus.classList.remove('visible');
            }, 3000);
          }
        } else {
          networkStatus.classList.add('offline');
          statusIcon.textContent = '⚠️';
          
          // Special message for offline.html page
          if (window.location.href.includes('offline.html')) {
            statusText.textContent = 'আপনি এখনও অফলাইন আছেন';
          } else {
            statusText.textContent = 'আপনি অফলাইন আছেন';
          }
          
          networkStatus.classList.add('visible');
          
          // Hide after 3 seconds unless on offline page
          if (!window.location.href.includes('offline.html')) {
            setTimeout(() => {
              networkStatus.classList.remove('visible');
            }, 3000);
          }
        }
      }
      
      // Check network status on page load
      window.addEventListener('load', updateNetworkStatus);
      
      // Update network status when it changes
      window.addEventListener('online', updateNetworkStatus);
      window.addEventListener('offline', updateNetworkStatus);
    }
    
    // Back-to-top button functionality
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
      // Show/hide the button based on scroll position
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTopButton.classList.add('visible');
        } else {
          backToTopButton.classList.remove('visible');
        }
      });
      
      // Scroll to top when button is clicked
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // Function to add custom classes to comparison operators after Prism.js highlights code
    function enhanceComparisonOperators() {
      // List of comparison operators in Python
      const comparisonOperators = ["==", "!=", ">", "<", ">=", "<="];
      
      // Find all operator tokens
      const operatorTokens = document.querySelectorAll('.token.operator');
      
      // Add the comparison-operator class to operators that are comparisons
      operatorTokens.forEach(token => {
        if (comparisonOperators.includes(token.textContent)) {
          token.classList.add('comparison-operator');
        }
      });
    }

    // Run after the page loads and after Prism.js highlights code
    document.addEventListener('DOMContentLoaded', function() {
      // Let Prism.js finish first (using a small timeout)
      setTimeout(enhanceComparisonOperators, 100);
    });
  });