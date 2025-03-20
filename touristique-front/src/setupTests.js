import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Ajouter TextEncoder et TextDecoder à l'environnement global
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;