import { createServer } from 'vite';
(async () => {
  const server = await createServer({
    server: { port: 5174 }
  });
  const module = await server.ssrLoadModule('/src/utils/tpsProvider.ts');
  const tps = module.getAllTps();
  console.log("Total TPs:", tps.length);
  if(tps.length > 0) console.log("First TP:", tps[0].title, tps[0].image);
  await server.close();
})();
