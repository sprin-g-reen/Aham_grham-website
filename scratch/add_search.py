import sys

file_path = r'd:\newyogaproject\newyogaproject\sacred-moon-oil.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add CSS
css = """    .search-container {
      position: relative;
      width: 100%;
      max-width: 400px;
    }

    .search-input {
      width: 100%;
      padding: 14px 20px 14px 48px;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 99px;
      color: #fff;
      font-size: 14px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
    }

    .search-input:focus {
      background: rgba(255, 255, 255, 0.07);
      border-color: rgba(59, 130, 246, 0.5);
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
    }

    .search-icon {
      position: absolute;
      left: 18px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.3);
      font-size: 20px;
      pointer-events: none;
      transition: color 0.3s ease;
    }

    .search-input:focus + .search-icon {
      color: #3b82f6;
    }
"""

if '</style>' in content:
    content = content.replace('</style>', css + '\n  </style>', 1)

# Add HTML
html = """        <div class="search-container mb-6">
          <input type="text" class="search-input" placeholder="Search for peace...">
          <span class="material-symbols-outlined search-icon">search</span>
        </div>
        <div>
"""

search_target = '<h2 class="text-3xl font-serif mb-2 text-white">Products</h2>'
if search_target in content:
    content = content.replace('<div>\n          ' + search_target, html + '          ' + search_target, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated sacred-moon-oil.html")
