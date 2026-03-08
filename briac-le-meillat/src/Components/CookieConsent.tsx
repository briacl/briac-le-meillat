import React from 'react';
import { useCookieConsent } from '../Contexts/CookieConsentContext';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Link
} from "@heroui/react";

/**
 * Bannière RGPD — s'affiche au premier arivée si aucun choix n'a été fait.
 * Non-dismissable : l'utilisateur doit faire un choix pour continuer.
 */
export const CookieConsent: React.FC = () => {
    const { cookieConsent, acceptCookies, rejectCookies } = useCookieConsent();

    // État pour contrôler la visibilité du modal
    const isOpen = cookieConsent === "pending";

    return (
        <Modal
            backdrop="blur"
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            hideCloseButton={true}
            isOpen={isOpen}
            placement="bottom"
            className="bg-white/90 dark:bg-[#0f0f1e]/90 backdrop-blur-md border border-[#0055ff]/20"
        >
            <ModalContent>
                <ModalHeader className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex gap-2 items-center">
                    <span className="text-2xl">🍪</span> Ce site utilise des cookies
                </ModalHeader>
                <ModalBody className="text-sm font-normal text-gray-600 dark:text-gray-300">
                    <p>
                        Nous utilisons des cookies essentiels pour le bon fonctionnement du site, ainsi que
                        des cookies optionnels pour améliorer votre expérience. Vous pouvez les accepter
                        tous ou vous y opposer. Votre choix sera mémorisé.
                    </p>
                    <Link className="text-sm text-[#0055ff] hover:text-[#0044cc] cursor-pointer block mt-1" href="#">
                        En savoir plus sur notre politique de confidentialité
                    </Link>
                </ModalBody>
                <ModalFooter className="flex justify-end gap-2 mt-2 pb-6 px-6">
                    <Button
                        className="rounded-full border border-gray-300 dark:border-gray-600 bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onPress={rejectCookies}
                    >
                        Refuser
                    </Button>
                    <Button
                        className="rounded-full bg-gradient-to-r from-[#0075FF] to-[#f336f0] text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                        onPress={acceptCookies}
                    >
                        Accepter tout
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
