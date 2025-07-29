// vite.config.mjs
import { defineConfig, loadEnv } from "file:///C:/Users/HIZKIA%20CHRISTOVITA/PROJECT/KAI%20DIVRE%20IV/ProjectDepoLoko/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/HIZKIA%20CHRISTOVITA/PROJECT/KAI%20DIVRE%20IV/ProjectDepoLoko/node_modules/@vitejs/plugin-react/dist/index.mjs";
import jsconfigPaths from "file:///C:/Users/HIZKIA%20CHRISTOVITA/PROJECT/KAI%20DIVRE%20IV/ProjectDepoLoko/node_modules/vite-jsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const API_URL = `${env.VITE_APP_BASE_NAME}`;
  const PORT = `${"3000"}`;
  return {
    server: {
      proxy: {
        "/api": "http://localhost:3001"
      }
    },
    define: {
      global: "window"
    },
    resolve: {
      //     alias: [
      //       {
      //         find: /^~(.+)/,
      //         replacement: path.join(process.cwd(), 'node_modules/$1')
      //       },
      //       {
      //         find: /^src(.+)/,
      //         replacement: path.join(process.cwd(), 'src/$1')
      //       }
      //     ]
    },
    preview: {
      // this ensures that the browser opens upon preview start
      open: true,
      port: PORT
    },
    base: API_URL,
    plugins: [react(), jsconfigPaths()]
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcSElaS0lBIENIUklTVE9WSVRBXFxcXFBST0pFQ1RcXFxcS0FJIERJVlJFIElWXFxcXFByb2plY3REZXBvTG9rb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcSElaS0lBIENIUklTVE9WSVRBXFxcXFBST0pFQ1RcXFxcS0FJIERJVlJFIElWXFxcXFByb2plY3REZXBvTG9rb1xcXFx2aXRlLmNvbmZpZy5tanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0hJWktJQSUyMENIUklTVE9WSVRBL1BST0pFQ1QvS0FJJTIwRElWUkUlMjBJVi9Qcm9qZWN0RGVwb0xva28vdml0ZS5jb25maWcubWpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IGpzY29uZmlnUGF0aHMgZnJvbSAndml0ZS1qc2NvbmZpZy1wYXRocyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG4gIGNvbnN0IEFQSV9VUkwgPSBgJHtlbnYuVklURV9BUFBfQkFTRV9OQU1FfWA7XG4gIC8vIHRoaXMgc2V0cyBhIGRlZmF1bHQgcG9ydCB0byAzMDAwXG4gIGNvbnN0IFBPUlQgPSBgJHsnMzAwMCd9YDtcblxuICByZXR1cm4ge1xuICAgIHNlcnZlcjoge1xuICAgICAgcHJveHk6IHtcbiAgICAgICAgJy9hcGknOiAnaHR0cDovL2xvY2FsaG9zdDozMDAxJ1xuICAgICAgfVxuICAgIH0sXG4gICAgZGVmaW5lOiB7XG4gICAgICBnbG9iYWw6ICd3aW5kb3cnXG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICAvLyAgICAgYWxpYXM6IFtcbiAgICAgIC8vICAgICAgIHtcbiAgICAgIC8vICAgICAgICAgZmluZDogL15+KC4rKS8sXG4gICAgICAvLyAgICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ25vZGVfbW9kdWxlcy8kMScpXG4gICAgICAvLyAgICAgICB9LFxuICAgICAgLy8gICAgICAge1xuICAgICAgLy8gICAgICAgICBmaW5kOiAvXnNyYyguKykvLFxuICAgICAgLy8gICAgICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdzcmMvJDEnKVxuICAgICAgLy8gICAgICAgfVxuICAgICAgLy8gICAgIF1cbiAgICB9LFxuICAgIHByZXZpZXc6IHtcbiAgICAgIC8vIHRoaXMgZW5zdXJlcyB0aGF0IHRoZSBicm93c2VyIG9wZW5zIHVwb24gcHJldmlldyBzdGFydFxuICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgIHBvcnQ6IFBPUlRcbiAgICB9LFxuICAgIGJhc2U6IEFQSV9VUkwsXG4gICAgcGx1Z2luczogW3JlYWN0KCksIGpzY29uZmlnUGF0aHMoKV1cbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzWSxTQUFTLGNBQWMsZUFBZTtBQUM1YSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxtQkFBbUI7QUFFMUIsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBQzNDLFFBQU0sVUFBVSxHQUFHLElBQUksa0JBQWtCO0FBRXpDLFFBQU0sT0FBTyxHQUFHLE1BQU07QUFFdEIsU0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixRQUFRO0FBQUEsSUFDVjtBQUFBLElBQ0EsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFXVDtBQUFBLElBQ0EsU0FBUztBQUFBO0FBQUEsTUFFUCxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0EsTUFBTTtBQUFBLElBQ04sU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7QUFBQSxFQUNwQztBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
