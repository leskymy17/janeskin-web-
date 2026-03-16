#!/bin/bash
# Propaguje obsah _nav.html a _footer.html do všech HTML stránek.
# Spusť po každé změně menu nebo patičky: ./build.sh

NAV=$(cat _nav.html)
FOOTER=$(cat _footer.html)

for FILE in *.html; do
  # Přeskoč partial soubory
  [[ "$FILE" == _* ]] && continue

  # Nahraď nav placeholder
  if grep -q 'id="nav-placeholder"' "$FILE"; then
    python3 -c "
import sys
content = open('$FILE').read()
nav = open('_nav.html').read()
result = content.replace('<div id=\"nav-placeholder\"></div>', nav)
open('$FILE', 'w').write(result)
"
    echo "✓ nav → $FILE"
  fi

  # Nahraď footer placeholder
  if grep -q 'id="footer-placeholder"' "$FILE"; then
    python3 -c "
import sys
content = open('$FILE').read()
footer = open('_footer.html').read()
result = content.replace('<div id=\"footer-placeholder\"></div>', footer)
open('$FILE', 'w').write(result)
"
    echo "✓ footer → $FILE"
  fi
done

echo "Hotovo."
