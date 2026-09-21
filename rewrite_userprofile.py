import io

with io.open('components/auth/UserProfile.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_use_effect = '''  // Load eco points from localStorage
  useEffect(() => {
    const loadPoints = () => {
      const pts = parseInt(localStorage.getItem('eco_points') || '0', 10);
      setEcoPoints(pts);
    };
    loadPoints();
    // Also listen for changes (in case they play the game in another tab/iframe, but for our setup this is fine)
    window.addEventListener('storage', loadPoints);
    return () => window.removeEventListener('storage', loadPoints);
  }, []);'''

new_use_effect = '''  // Load eco points from API
  useEffect(() => {
    const loadPoints = async () => {
      try {
        const res = await fetch('/api/game/score');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setEcoPoints(data.totalScore);
          }
        }
      } catch (err) {
        console.error('Failed to load points');
      }
    };
    loadPoints();
    // Listen for visibility change to reload points when coming back from game tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadPoints();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);'''

text = text.replace(old_use_effect, new_use_effect)

with io.open('components/auth/UserProfile.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("done")
