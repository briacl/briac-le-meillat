/**
 * DocumentExporter - Gère le téléchargement et l'export PDF des documents.
 */

export const exportToPDF = (title: string, path: string) => {
    const isMarkdown = path.toLowerCase().endsWith('.md');
    const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
    
    if (isMarkdown) {
        // Pour le Markdown, on utilise la fonction print du navigateur.
        // On suppose que l'utilisateur est déjà sur la page du document ou que la modale est ouverte.
        // Si on veut être précis, on pourrait ouvrir une fenêtre temporaire avec le contenu MD formaté.
        window.print();
    } else {
        // Pour les PDF, on déclenche le téléchargement direct.
        const link = document.createElement('a');
        link.href = `${baseUrl}${path.startsWith('/') ? path.slice(1) : path}`;
        link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const readDocument = (path: string, onMarkdown: () => void) => {
    const isMarkdown = path.toLowerCase().endsWith('.md');
    const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

    if (isMarkdown) {
        onMarkdown();
    } else {
        // Ouvrir le PDF dans un nouvel onglet
        window.open(`${baseUrl}${path.startsWith('/') ? path.slice(1) : path}`, '_blank');
    }
};
