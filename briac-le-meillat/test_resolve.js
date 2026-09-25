const projectImages = {
  '/src/assets/projects/cortex-logo.jpg': { default: '/briac-le-meillat/src/assets/projects/cortex-logo.jpg' },
  '/src/assets/projects/briac_website.png': { default: '/briac-le-meillat/src/assets/projects/briac_website.png' }
};

function resolveLogoUrl(rawImagePath) {
    if (!rawImagePath) return null;
    const parts = rawImagePath.split('/');
    const filename = parts[parts.length - 1];
    const matchingKey = Object.keys(projectImages).find(k => k.endsWith(`/${filename}`));
    if (matchingKey) {
        const imgModule = projectImages[matchingKey];
        return typeof imgModule === 'string' ? imgModule : imgModule.default;
    }
    return rawImagePath;
}

console.log('cortex:', resolveLogoUrl('/briac-le-meillat/assets/projects/cortex-logo.jpg'));
console.log('heryze:', resolveLogoUrl('/briac-le-meillat/assets/projects/heryze-logo.jpg'));
