import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Shield, Lock, FileText, User, Stethoscope, Building, Mail, Camera } from 'lucide-react';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';

const Subscribe = () => {
    useEffect(() => {
        document.title = "Inscription Professionnel - briac-le-meillat";
    }, []);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        rpps: '',
        adeli: '',
        siretFiness: '',
        typeEtablissement: 'liberal',
        nom: '',
        prenoms: '',
        dateNaissance: '',
        lieuNaissance: '',
        profession: '',
        specialite: '',
        email: '',
        mobile: ''
    });

    const [files, setFiles] = useState<{
        identity: File | null;
        cps: File | null;
        insurance: File | null;
        selfie: File | null;
    }>({
        identity: null,
        cps: null,
        insurance: null,
        selfie: null
    });

    const [rppsVerified, setRppsVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    // Simulation de la vérification automatique RPPS
    const verifyRPPS = async (rppsNumber: string) => {
        if (rppsNumber.length === 11) {
            setLoading(true);
            // Simulation d'appel API
            setTimeout(() => {
                setFormData(prev => ({
                    ...prev,
                    nom: 'DUPONT',
                    prenoms: 'Marie Christine',
                    profession: 'Infirmier',
                    specialite: 'Libéral'
                }));
                setRppsVerified(true);
                setLoading(false);
            }, 1500);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'rpps') {
            verifyRPPS(value);
        }
    };

    const handleFileUpload = (type: keyof typeof files) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setFiles(prev => ({ ...prev, [type]: file }));
        }
    };

    const professions = [
        'Médecin',
        'Infirmier',
        'Kinésithérapeute',
        'Sage-femme',
        'Pharmacien',
        'Dentiste',
        'Psychologue'
    ];

    const specialites = [
        'Libéral',
        'Psychiatre',
        'Généraliste',
        'Pédiatre',
        'Urgentiste',
        'Autre'
    ];

    const FileUploadBox = ({ icon: Icon, title, subtitle, type, file, required = true }: any) => (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 transition-all">
            <input
                type="file"
                id={type}
                className="hidden"
                onChange={handleFileUpload(type)}
                accept={type === 'selfie' ? 'image/*' : 'image/*,application/pdf'}
            />
            <label htmlFor={type} className="cursor-pointer">
                <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-full ${file ? 'bg-green-100' : 'bg-gray-100'} mb-3`}>
                        {file ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                            <Icon className="w-6 h-6 text-gray-500" />
                        )}
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                        {title}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{subtitle}</p>
                    {file ? (
                        <p className="text-xs text-green-600 font-medium">{file.name}</p>
                    ) : (
                        <p className="text-xs text-gray-500">Cliquez pour télécharger</p>
                    )}
                </div>
            </label>
        </div>
    );

    return (
        <div className="min-h-screen relative font-sans text-gray-900 bg-[#f8f9fa] overflow-hidden">

            <div className="absolute inset-0 z-0">
                <NeuralNetworkBackground />
            </div>

            <div className="relative z-10 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg shadow-blue-600/30">
                            <Stethoscope className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Inscription Professionnel de Santé
                        </h1>
                        <p className="text-gray-600">
                            Processus sécurisé et conforme
                        </p>
                    </div>

                    {/* Security badges */}
                    <div className="flex justify-center gap-4 mb-12">
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/20">
                            <Lock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Chiffrement E2E</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/20">
                            <FileText className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Conforme RGPD</span>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-8">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center flex-1">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold shadow-lg transition-all ${step >= s ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-white text-gray-400 border border-gray-200'
                                        }`}>
                                        {s}
                                    </div>
                                    {s < 3 && (
                                        <div className={`flex-1 h-1 mx-2 rounded-full ${step > s ? 'bg-blue-600' : 'bg-gray-300'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center text-sm">
                            <div className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                                Identifiants
                            </div>
                            <div className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                                Justificatifs
                            </div>
                            <div className={step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                                Validation
                            </div>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-[10px] animate-fade-in">
                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Étape 1 : Informations Professionnelles</h2>

                                {/* Identifiants métiers */}
                                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Building className="w-5 h-5 text-blue-600" />
                                        Identifiants Métiers
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Numéro RPPS <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="rpps"
                                                value={formData.rpps}
                                                onChange={handleInputChange}
                                                placeholder="11 chiffres"
                                                maxLength={11}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            {loading && (
                                                <p className="text-sm text-blue-600 mt-2">🔄 Vérification en cours...</p>
                                            )}
                                            {rppsVerified && (
                                                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                                                    <CheckCircle className="w-4 h-4" />
                                                    RPPS vérifié - Données pré-remplies
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Numéro ADELI (optionnel)
                                                </label>
                                                <input
                                                    type="text"
                                                    name="adeli"
                                                    value={formData.adeli}
                                                    onChange={handleInputChange}
                                                    placeholder="Pour professions en transition"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Type d'établissement <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="typeEtablissement"
                                                    value={formData.typeEtablissement}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="liberal">Libéral (SIRET)</option>
                                                    <option value="salarie">Salarié (FINESS)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {formData.typeEtablissement === 'liberal' ? 'Numéro SIRET' : 'Numéro FINESS'} <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="siretFiness"
                                                value={formData.siretFiness}
                                                onChange={handleInputChange}
                                                placeholder={formData.typeEtablissement === 'liberal' ? '14 chiffres' : '9 chiffres'}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Identité civile */}
                                <div className="bg-purple-50 rounded-xl p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5 text-purple-600" />
                                        Identité Civile (doit correspondre à votre CNI)
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nom de naissance <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="nom"
                                                value={formData.nom}
                                                onChange={handleInputChange}
                                                disabled={rppsVerified}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prénoms (tous) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="prenoms"
                                                value={formData.prenoms}
                                                onChange={handleInputChange}
                                                disabled={rppsVerified}
                                                placeholder="Tous vos prénoms dans l'ordre de l'état civil"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Date de naissance <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="dateNaissance"
                                                    value={formData.dateNaissance}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Lieu de naissance <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lieuNaissance"
                                                    value={formData.lieuNaissance}
                                                    onChange={handleInputChange}
                                                    placeholder="Ville, Pays"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Profil professionnel */}
                                <div className="bg-green-50 rounded-xl p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Stethoscope className="w-5 h-5 text-green-600" />
                                        Profil Professionnel
                                    </h3>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Profession <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="profession"
                                                value={formData.profession}
                                                onChange={handleInputChange}
                                                disabled={rppsVerified}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                                            >
                                                <option value="">Sélectionnez</option>
                                                {professions.map(p => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Spécialité <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="specialite"
                                                value={formData.specialite}
                                                onChange={handleInputChange}
                                                disabled={rppsVerified}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                                            >
                                                <option value="">Sélectionnez</option>
                                                {specialites.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact sécurisé */}
                                <div className="bg-orange-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-orange-600" />
                                        Contact Sécurisé
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email professionnel <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="prenom.nom@mssante.fr (recommandé)"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            />
                                            <p className="text-xs text-gray-600 mt-1">
                                                Les adresses @mssante.fr sont prioritaires pour la sécurité
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Numéro de mobile <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                                placeholder="+33 6 12 34 56 78"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            />
                                            <p className="text-xs text-gray-600 mt-1">
                                                Utilisé pour l'authentification à deux facteurs (2FA)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    Continuer vers les justificatifs
                                    <CheckCircle className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Étape 2 : Justificatifs</h2>

                                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-yellow-800">
                                                Tous les documents seront chiffrés et supprimés après validation
                                            </p>
                                            <p className="text-xs text-yellow-700 mt-1">
                                                Formats acceptés : JPG, PNG, PDF • Taille max : 10 Mo par fichier
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <FileUploadBox
                                        icon={User}
                                        title="Pièce d'identité"
                                        subtitle="CNI ou Passeport (recto-verso)"
                                        type="identity"
                                        file={files.identity}
                                    />

                                    <FileUploadBox
                                        icon={FileText}
                                        title="Carte CPS ou Attestation Ordre"
                                        subtitle="Preuve d'exercice professionnelle"
                                        type="cps"
                                        file={files.cps}
                                    />

                                    <FileUploadBox
                                        icon={Shield}
                                        title="Assurance RCP"
                                        subtitle="Responsabilité Civile Professionnelle"
                                        type="insurance"
                                        file={files.insurance}
                                    />

                                    <FileUploadBox
                                        icon={Camera}
                                        title="Selfie avec CNI"
                                        subtitle="Lutte anti-fraude (recommandé)"
                                        type="selfie"
                                        file={files.selfie}
                                        required={false}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-lg transition-colors"
                                    >
                                        Retour
                                    </button>
                                    <button
                                        onClick={() => setStep(3)}
                                        disabled={!files.identity || !files.cps || !files.insurance}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        Soumettre le dossier
                                        <CheckCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>

                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Dossier Soumis avec Succès !
                                </h2>

                                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                                    Votre demande d'inscription est en cours de vérification. Notre équipe va procéder aux contrôles suivants :
                                </p>

                                <div className="bg-blue-50 rounded-xl p-6 max-w-2xl mx-auto mb-8">
                                    <h3 className="font-semibold text-gray-800 mb-4">Vérifications en cours :</h3>
                                    <ul className="space-y-3 text-left">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">Croisement RPPS avec fichier personne-activite</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">Validation des titres (fichier dipl-autexerc)</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">Authenticité des pièces justificatives</span>
                                        </li>
                                    </ul>
                                </div>

                                <p className="text-sm text-gray-500">
                                    Vous recevrez un email de validation sous 24 à 48h.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscribe;
