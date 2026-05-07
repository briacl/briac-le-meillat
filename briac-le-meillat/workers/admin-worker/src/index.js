export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Admin-Password",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    const password = request.headers.get("X-Admin-Password");
    if (password !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Accès refusé" }), { status: 401, headers: corsHeaders });
    }

    if (request.method === "POST") {
      try {
        const formData = await request.formData();
        const file = formData.get("file");
        const title = formData.get("title");
        // Le Frontend envoie 'resourceId', pas 'resource'
        const resourceId = formData.get("resourceId");

        if (!file || !title || !resourceId) {
          throw new Error("Champs manquants. Veuillez remplir tous les champs.");
        }

        const fileName = `tp-${resourceId}-${Date.now()}.pdf`;
        // Important: Le chemin doit inclure le dossier briac-le-meillat si ton site Vite est dedans
        const filePath = `briac-le-meillat/public/tps/${fileName}`;
        const arrayBuffer = await file.arrayBuffer();
        const base64Content = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

        // 1. Upload du PDF sur GitHub
        const uploadRes = await fetch(`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${filePath}`, {
          method: "PUT",
          headers: {
            "Authorization": `token ${env.GITHUB_TOKEN}`,
            "User-Agent": "Cloudflare-Worker",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `upload tp : ${title} (${resourceId})`,
            content: base64Content,
            branch: env.GITHUB_BRANCH
          }),
        });

        if (!uploadRes.ok) {
          const errDetails = await uploadRes.json();
          throw new Error(`Échec de l'upload du PDF: ${errDetails.message}`);
        }

        // 2. Mise à jour du registre tps.json
        const jsonPath = "briac-le-meillat/public/data/tps.json";
        const getJson = await fetch(`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${jsonPath}?ref=${env.GITHUB_BRANCH}`, {
          headers: { "Authorization": `token ${env.GITHUB_TOKEN}`, "User-Agent": "Cloudflare-Worker" }
        });

        let currentContent = [];
        let sha = null;

        if (getJson.ok) {
          const jsonData = await getJson.json();
          sha = jsonData.sha;
          // Indispensable: GitHub rajoute des retours à la ligne (\n) dans son Base64 qui font planter atob()
          const decodedContent = atob(jsonData.content.replace(/\n/g, ""));
          currentContent = JSON.parse(decodedContent);
        }

        // Les clés doivent correspondre exactement à ce qu'attend CompetencesBUT.tsx
        currentContent.push({
          id: `tp-${Date.now()}`,
          titre: title,
          ressource: resourceId,
          fichier: `/tps/${fileName}`,
          date: new Date().toLocaleDateString('fr-FR')
        });

        const updateJson = await fetch(`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${jsonPath}`, {
          method: "PUT",
          headers: {
            "Authorization": `token ${env.GITHUB_TOKEN}`,
            "User-Agent": "Cloudflare-Worker",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `update tps.json: ajout de ${title}`,
            content: btoa(JSON.stringify(currentContent, null, 2)),
            sha: sha,
            branch: env.GITHUB_BRANCH
          }),
        });

        if (!updateJson.ok) {
          const errDetails = await updateJson.json();
          throw new Error(`Échec de la mise à jour de tps.json: ${errDetails.message}`);
        }

        return new Response(JSON.stringify({ success: true, fileName }), { headers: corsHeaders });

      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }
    return new Response("Méthode non autorisée", { status: 405, headers: corsHeaders });
  }
};
