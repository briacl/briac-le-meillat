#!/usr/bin/env python3
"""
Serveur HTTP simple pour streaming vidéo local
Optimisé pour servir de gros fichiers avec support du Range header
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

# Configuration
PORT = 8888
VIDEO_DIR = Path(__file__).parent.parent / "berangere-videos"

class VideoHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Handler HTTP avec support complet du Range header pour le streaming"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(VIDEO_DIR), **kwargs)
    
    def end_headers(self):
        """Ajouter les headers CORS et cache"""
        # CORS - Autoriser les requêtes depuis Vite
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Range')
        
        # Cache
        self.send_header('Cache-Control', 'public, max-age=3600')
        
        # Indiquer que le serveur accepte les range requests
        self.send_header('Accept-Ranges', 'bytes')
        
        super().end_headers()
    
    def do_OPTIONS(self):
        """Gérer les requêtes OPTIONS (CORS preflight)"""
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        """Format de log personnalisé"""
        sys.stdout.write("%s - [%s] %s\n" %
                         (self.address_string(),
                          self.log_date_time_string(),
                          format % args))


def main():
    # Créer le dossier vidéos s'il n'existe pas
    VIDEO_DIR.mkdir(exist_ok=True)
    
    # Afficher le banner
    print("=" * 60)
    print("🎬 Serveur de Streaming Vidéo - Bérangère")
    print("=" * 60)
    print(f"📁 Dossier vidéos: {VIDEO_DIR}")
    print(f"🌐 Serveur démarré sur: http://localhost:{PORT}")
    print(f"📺 Base URL vidéos: http://localhost:{PORT}/videos/")
    print("=" * 60)
    print("✓ Support du Range header (streaming progressif)")
    print("✓ Support CORS activé")
    print("✓ Cache HTTP activé")
    print("=" * 60)
    
    # Lister les vidéos disponibles
    videos = list(VIDEO_DIR.glob("*.mp4")) + list(VIDEO_DIR.glob("*.webm"))
    if videos:
        print(f"\n📹 Vidéos disponibles ({len(videos)}):")
        for video in sorted(videos):
            size_mb = video.stat().st_size / (1024 * 1024)
            print(f"   • {video.name} ({size_mb:.1f} MB)")
            print(f"     URL: http://localhost:{PORT}/videos/{video.name}")
    else:
        print("\n⚠️  Aucune vidéo trouvée dans le dossier")
        print(f"   Ajoutez vos vidéos dans: {VIDEO_DIR}")
    
    print("\n" + "=" * 60)
    print("Appuyez sur Ctrl+C pour arrêter le serveur")
    print("=" * 60 + "\n")
    
    # Démarrer le serveur
    with socketserver.TCPServer(("", PORT), VideoHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Arrêt du serveur...")
            sys.exit(0)


if __name__ == "__main__":
    main()
