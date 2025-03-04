import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
    typeService: yup.string().required("Type de service requis"),
    nom: yup.string().required("Nom requis"),
    description: yup.string().required("Description requise"),
    prix: yup.number().positive("Le prix doit être positif").required("Prix requis"),
    disponibilite: yup.boolean().required("Disponibilité requise"),
    menu: yup.array().optional(),
    optionRegime: yup.array().optional(),
    type: yup.string().optional(),
    date: yup.date().optional(),
    duration: yup.number().optional(),
});

const AddService = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const typeService = watch("typeService");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios
                .get("http://localhost:8080/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    if (response.data.role !== "PROVIDER") {
                        navigate("/");
                    } else {
                        setUser(response.data);
                    }
                })
                .catch(() => navigate("/login"));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const onSubmit = async (data) => {
        const token = localStorage.getItem("token");
        let endpoint = "";
        if (data.typeService === "transport") {
            endpoint = "/services/transport";
        } else if (data.typeService === "restauration") {
            endpoint = "/services/restauration";
        }

        try {
            await axios.post(`http://localhost:8080${endpoint}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Service ajouté avec succès !");
            navigate("/dashboard");
        } catch (error) {
            alert("Erreur lors de l'ajout du service");
        }
    };

    return (
        <div>
            <h2>Ajouter un Service</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Type de Service:</label>
                <select {...register("typeService")}>
                    <option value="">Sélectionner...</option>
                    <option value="transport">Transport</option>
                    <option value="restauration">Restauration</option>
                </select>
                <p>{errors.typeService?.message}</p>

                <label>Nom:</label>
                <input type="text" {...register("nom")} />
                <p>{errors.nom?.message}</p>

                <label>Description:</label>
                <textarea {...register("description")} />
                <p>{errors.description?.message}</p>

                <label>Prix:</label>
                <input type="number" {...register("prix")} />
                <p>{errors.prix?.message}</p>

                <label>Disponibilité:</label>
                <select {...register("disponibilite")}>
                    <option value="true">Disponible</option>
                    <option value="false">Indisponible</option>
                </select>
                <p>{errors.disponibilite?.message}</p>

                {typeService === "restauration" && (
                    <>
                        <label>Menu:</label>
                        <input type="text" {...register("menu")} />

                        <label>Options de Régime:</label>
                        <input type="text" {...register("optionRegime")} />
                    </>
                )}

                {typeService === "transport" && (
                    <>
                        <label>Type de Transport:</label>
                        <input type="text" {...register("type")} />

                        <label>Date:</label>
                        <input type="date" {...register("date")} />

                        <label>Durée (en minutes):</label>
                        <input type="number" {...register("duration")} />
                    </>
                )}

                <button type="submit">Ajouter</button>
            </form>
        </div>
    );
};

export default AddService;
