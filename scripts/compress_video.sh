#!/bin/bash

# ===============================================
# Script de compression vidéo pour Bérangère
# ===============================================
# Utilisation: ./compress_video.sh input.mp4 output_name
# Exemple: ./compress_video.sh /chemin/vers/episode.mp4 s1e1-beethoven

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction d'affichage
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Vérifier ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    print_error "FFmpeg n'est pas installé !"
    echo "Installation: sudo apt install ffmpeg"
    exit 1
fi

# Vérifier les arguments
if [ "$#" -lt 1 ]; then
    print_error "Usage: $0 <fichier_video_input> [nom_output]"
    echo "Exemple: $0 /path/to/episode.mp4 s1e1-beethoven"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_NAME="${2:-compressed}"

# Vérifier que le fichier existe
if [ ! -f "$INPUT_FILE" ]; then
    print_error "Le fichier '$INPUT_FILE' n'existe pas !"
    exit 1
fi

# Créer le dossier de sortie s'il n'existe pas
OUTPUT_DIR="$(dirname "$0")/../berangere-videos"
mkdir -p "$OUTPUT_DIR"

# Chemin de sortie
OUTPUT_FILE="$OUTPUT_DIR/${OUTPUT_NAME}.mp4"

# Afficher les informations
print_info "Fichier d'entrée: $INPUT_FILE"
print_info "Fichier de sortie: $OUTPUT_FILE"

# Obtenir la taille du fichier d'entrée
INPUT_SIZE=$(du -h "$INPUT_FILE" | cut -f1)
print_info "Taille originale: $INPUT_SIZE"

echo ""
print_info "🎬 Compression en cours (H.265 - Haute qualité)..."
print_warning "Cela peut prendre plusieurs minutes selon la taille..."
echo ""

# Compression avec H.265 (HEVC) - Excellent compromis qualité/taille
# CRF 28 = Haute qualité, taille réduite de ~40-60%
# preset medium = Bon compromis vitesse/compression
ffmpeg -i "$INPUT_FILE" \
    -c:v libx265 \
    -crf 28 \
    -preset medium \
    -c:a aac \
    -b:a 128k \
    -movflags +faststart \
    -metadata title="${OUTPUT_NAME}" \
    "$OUTPUT_FILE" \
    -y

# Vérifier la réussite
if [ $? -eq 0 ]; then
    echo ""
    print_success "Compression terminée avec succès !"
    
    # Afficher les tailles
    OUTPUT_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
    print_info "Taille compressée: $OUTPUT_SIZE"
    
    # Calculer le pourcentage de réduction
    INPUT_BYTES=$(stat -f%z "$INPUT_FILE" 2>/dev/null || stat -c%s "$INPUT_FILE")
    OUTPUT_BYTES=$(stat -f%z "$OUTPUT_FILE" 2>/dev/null || stat -c%s "$OUTPUT_FILE")
    REDUCTION=$(echo "scale=1; (1 - $OUTPUT_BYTES / $INPUT_BYTES) * 100" | bc)
    
    print_success "Réduction de taille: ${REDUCTION}%"
    echo ""
    print_info "📁 Fichier disponible à: $OUTPUT_FILE"
    echo ""
    print_info "🔗 URL pour berangere-series.json:"
    echo -e "${GREEN}    \"videoLink\": \"http://localhost:8888/videos/${OUTPUT_NAME}.mp4\"${NC}"
    echo ""
else
    print_error "Erreur lors de la compression !"
    exit 1
fi
