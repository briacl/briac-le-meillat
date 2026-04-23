export const supabase = {
  functions: {
    invoke: async (name: string, options: any) => {
      console.log('Mock: supabase.functions.invoke', name, options);
      return { data: { success: true }, error: null };
    }
  }
};
