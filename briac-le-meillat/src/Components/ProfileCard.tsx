import GlassCard from './GlassCard';

export default function ProfileCard() {
    return (
        <GlassCard className="h-full w-full max-w-sm flex flex-col items-center justify-center p-8">
            <div className="relative mb-6 group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ff] to-[#0055ff] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>

                {/* Profile Image container */}
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                    <img
                        src="/assets/IMG_2119.JPG"
                        alt="Briac Le Meillat"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            // Fallback if image not found
                            (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Briac+Le+Meillat&background=0D8ABC&color=fff&size=200";
                        }}
                    />
                </div>
            </div>

            <h3 className="font-['Paris2024'] text-2xl font-bold bg-gradient-to-r from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent mb-2 text-center">
                BRIAC LE MEILLAT
            </h3>

            <p className="font-['Paris2024'] text-sm text-skin-text-secondary text-center uppercase tracking-widest mb-6">
                Étudiant Ingénieur
            </p>

            <div className="flex gap-4">
                {/* Social/Contact placeholders or small icons could go here */}
            </div>
        </GlassCard>
    );
}
