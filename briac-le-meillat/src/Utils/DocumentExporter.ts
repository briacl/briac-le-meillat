export const exportToPDF = (title: string, path: string) => {
    const isMarkdown = path.toLowerCase().endsWith('.md');
    const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

    if (isMarkdown) {
        const params = new URLSearchParams({ file: path, title, print: '1' });
        window.open(`${baseUrl}ex?${params.toString()}`, '_blank');
    } else {
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
        window.open(`${baseUrl}${path.startsWith('/') ? path.slice(1) : path}`, '_blank');
    }
};
