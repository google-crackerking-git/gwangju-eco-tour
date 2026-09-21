import io
import re

with io.open('public/minigame.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix syntax error (remove stray `});` before `updateHUD();`)
text = text.replace("            }\n            });\n\n            updateHUD();", "            }\n\n            updateHUD();")

# Inject Exit Button into the HTML
exit_btn_html = """
        <!-- Mobile Control Buttons -->
"""

new_exit_btn_html = """
        <!-- Exit Game Button -->
        <button onclick="window.location.href='/'" class="absolute top-5 right-5 w-10 h-10 bg-slate-900/60 hover:bg-red-500/80 backdrop-blur-md rounded-full flex items-center justify-center text-white z-40 shadow-lg border border-white/20 transition transform hover:scale-110 active:scale-95 hidden" id="ingame-exit-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        
        <!-- Mobile Control Buttons -->
"""

text = text.replace(exit_btn_html, new_exit_btn_html)

# We need to show the button when game starts and hide it on start screen
text = text.replace("document.getElementById('start-screen').classList.add('hidden');", "document.getElementById('start-screen').classList.add('hidden');\n                  document.getElementById('ingame-exit-btn').classList.remove('hidden');")

text = text.replace("document.getElementById('start-screen').classList.remove('hidden');", "document.getElementById('start-screen').classList.remove('hidden');\n                  document.getElementById('ingame-exit-btn').classList.add('hidden');")

# Also hide it on the end screen
text = text.replace("document.getElementById('end-screen').classList.remove('hidden');", "document.getElementById('end-screen').classList.remove('hidden');\n                    document.getElementById('ingame-exit-btn').classList.add('hidden');")

with io.open('public/minigame.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("done")
