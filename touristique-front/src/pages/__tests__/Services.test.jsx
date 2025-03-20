import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Services from "../Services";
import ReviewModal from "../../components/ReviewModal.jsx";
import * as router from "react-router-dom";

// Mock des dépendances
jest.mock("framer-motion", () => ({
    motion: {
        div: (props) => <div {...props} />,
    },
}));

// Mock de localStorage
const mockLocalStorage = (token = null, role = null) => {
    const localStorageMock = {
        getItem: jest.fn((key) => {
            if (key === "token") return token;
            if (key === "role") return role;
            return null;
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
        writable: true,
    });
    return localStorageMock;
};

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => jest.fn(),
    Link: (props) => <a {...props} />,
}));

// Mock ReviewModal
jest.mock("../../components/ReviewModal.jsx", () => (props) => (
    <div data-testid="review-modal" className={props.isOpen ? "visible" : "hidden"}>
        Review Modal Mock
    </div>
));

describe("Services Component", () => {
    let axiosMock;
    let navigateMock;

    beforeEach(() => {
        axiosMock = new MockAdapter(axios);
        navigateMock = jest.fn();
        jest.spyOn(router, "useNavigate").mockReturnValue(navigateMock);
        mockLocalStorage("mock-token", "USER");
    });

    afterEach(() => {
        axiosMock.reset();
        jest.clearAllMocks();
    });

    it("renders the component correctly", () => {
        render(
            <MemoryRouter>
                <Services />
            </MemoryRouter>
        );

        expect(screen.getByText("Découvrez nos services")).toBeInTheDocument();
        expect(screen.getByText("Explorez notre sélection de services pour votre voyage au Maroc")).toBeInTheDocument();
        expect(screen.getByText("Ajouter un service")).toBeInTheDocument();
    });

    it("fetches and displays services on mount", async () => {
        const mockServices = [
            {
                id: 1,
                nom: "Transport Test",
                description: "Description Test",
                prix: 100,
                disponibilite: true,
                imageUrl: "/images/transport.jpg",
                type: "Bus",
                date: "2025-03-20T10:00:00Z",
                duration: 120,
                providerId: 1,
            },
        ];

        axiosMock.onGet("/api/services/all").reply(200, mockServices);
        axiosMock.onGet("/api/auth/me").reply(200, { id: 1, role: "USER" });

        render(
            <MemoryRouter>
                <Services />
            </MemoryRouter>
        );

        // Check loading state
        expect(screen.getByRole("status")).toBeInTheDocument();

        // Wait for services to load
        await waitFor(() => {
            expect(screen.getByText("Transport Test")).toBeInTheDocument();
            expect(screen.getByText("Description Test")).toBeInTheDocument();
            expect(screen.getByText("100 MAD")).toBeInTheDocument();
        });
    });

    // Test 3 : Redirection si pas de token
    it("redirects to login if no token is present", () => {
        mockLocalStorage(null, null);

        render(
            <MemoryRouter>
                <Services />
            </MemoryRouter>
        );

        expect(navigateMock).toHaveBeenCalledWith("/login");
        expect(screen.getByText("Veuillez vous connecter pour voir les services")).toBeInTheDocument();
    });

    // Test 4 : Filtrage des services
    it("filters services based on search query", async () => {
        const mockServices = [
            {
                id: 1,
                nom: "Transport Test",
                description: "Description Test",
                prix: 100,
                disponibilite: true,
                imageUrl: "/images/transport.jpg",
                type: "Bus",
                date: "2025-03-20T10:00:00Z",
                duration: 120,
                providerId: 1,
            },
            {
                id: 2,
                nom: "Restauration Test",
                description: "Description Restauration",
                prix: 50,
                disponibilite: true,
                imageUrl: "/images/restauration.jpg",
                menu: ["Plat 1", "Plat 2"],
                providerId: 1,
            },
        ];

        axiosMock.onGet("/api/services/all").reply(200, mockServices);

        render(
            <MemoryRouter>
                <Services />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Transport Test")).toBeInTheDocument();
            expect(screen.getByText("Restauration Test")).toBeInTheDocument();
        });

        // Simuler une recherche
        const searchInput = screen.getByPlaceholderText("Rechercher un service...");
        fireEvent.change(searchInput, { target: { value: "Transport" } });

        // Vérifier que seul le service correspondant est affiché
        expect(screen.getByText("Transport Test")).toBeInTheDocument();
        expect(screen.queryByText("Restauration Test")).not.toBeInTheDocument();
    });

    // Test 5 : Ouverture du modal de détails
    it("opens the service details modal when clicking on Détails", async () => {
        const mockServices = [
            {
                id: 1,
                nom: "Transport Test",
                description: "Description Test",
                prix: 100,
                disponibilite: true,
                imageUrl: "/images/transport.jpg",
                type: "Bus",
                date: "2025-03-20T10:00:00Z",
                duration: 120,
                providerId: 1,
            },
        ];

        axiosMock.onGet("/api/services/all").reply(200, mockServices);

        render(
            <MemoryRouter>
                <Services />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Transport Test")).toBeInTheDocument();
        });

        // Cliquer sur le bouton "Détails"
        const detailsButton = screen.getByText("Détails");
        fireEvent.click(detailsButton);

        // Vérifier que le modal est ouvert
        expect(screen.getByText("Transport Test")).toBeInTheDocument();
        expect(screen.getByText("Description Test")).toBeInTheDocument();
        expect(screen.getByText("100 MAD")).toBeInTheDocument();
    });

    // Test 6 : Réservation d'un service
    it("handles service reservation correctly", async () => {
        const mockServices = [
            {
                id: 1,
                nom: "Transport Test",
                description: "Description Test",
                prix: 100,
                disponibilite: true,
                imageUrl: "/images/transport.jpg",
                type: "Bus",
                date: "2025-03-20T10:00:00Z",
                duration: 120,
                providerId: 1,
            },
        ];

        axiosMock.onGet("/api/services/all").reply(200, mockServices);
        axiosMock.onPost("/api/reservations/reserver/1").reply(200, { id: "reservation-123" });

        render(
            <MemoryRouter>
                <Services />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Transport Test")).toBeInTheDocument();
        });

        // Cliquer sur le bouton "Réserver"
        const reserveButton = screen.getByText("Réserver");
        fireEvent.click(reserveButton);

        // Vérifier la redirection vers la page de paiement
        await waitFor(() => {
            expect(navigateMock).toHaveBeenCalledWith("/payment", {
                state: { reservationId: "reservation-123", amount: 100 },
            });
        });
    });

    // Test 7 : Ouverture du modal de review
    it("opens the review modal when clicking on Ajouter une review", async () => {
        const mockServices = [
            {
                id: 1,
                nom: "Transport Test",
                description: "Description Test",
                prix: 100,
                disponibilite: true,
                imageUrl: "/images/transport.jpg",
                type: "Bus",
                date: "2025-03-20T10:00:00Z",
                duration: 120,
                providerId: 1,
            },
        ];

        axiosMock.onGet("/api/services/all").reply(200, mockServices);

        render(
            <MemoryRouter>
                <Services />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Transport Test")).toBeInTheDocument();
        });

        // Cliquer sur le bouton "Ajouter une review"
        const reviewButton = screen.getByText("Ajouter une review");
        fireEvent.click(reviewButton);

        // Vérifier que le modal de review est ouvert
        const reviewModal = screen.getByTestId("review-modal");
        expect(reviewModal).toHaveClass("visible");
    });

    // Test 8 : Affichage des boutons d'édition/suppression pour le propriétaire
    it("shows edit and delete buttons for service owner", async () => {
        mockLocalStorage("mock-token", "PROVIDER");
        axiosMock.onGet("/api/auth/me").reply(200, { id: 1, role: "PROVIDER" });

        const mockServices = [
            {
                id: 1,
                nom: "Transport Test",
                description: "Description Test",
                prix: 100,
                disponibilite: true,
                imageUrl: "/images/transport.jpg",
                type: "Bus",
                date: "2025-03-20T10:00:00Z",
                duration: 120,
                providerId: 1,
            },
        ];

        axiosMock.onGet("/api/services/all").reply(200, mockServices);

        render(
            <MemoryRouter>
                <Services />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Transport Test")).toBeInTheDocument();
        });

        // Vérifier la présence des boutons d'édition et de suppression
        expect(screen.getAllByTitle("Modifier")[0]).toBeInTheDocument();
        expect(screen.getAllByTitle("Supprimer")[0]).toBeInTheDocument();
    });

    // Test 9 : Gestion des erreurs API
    it("displays error message on API failure", async () => {
        axiosMock.onGet("/api/services/all").reply(500, { message: "Erreur serveur" });

        render(
            <MemoryRouter>
                <Services />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Erreur serveur")).toBeInTheDocument();
        });
    });
});