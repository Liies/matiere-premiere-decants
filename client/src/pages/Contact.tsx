import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const submitContact = trpc.contact.submit.useMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitContact.mutateAsync({
        ...formData,
        subject: formData.subject as "commande" | "produit" | "livraison" | "autre",
      });
      toast.success("Message envoyé avec succès ! Nous vous répondrons bientôt.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Erreur lors de l'envoi du message. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900">
            Nous Contacter
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Une question ? Nous sommes là pour vous aider.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            {/* Email */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-gray-900" />
                </div>
              </div>
              <h3 className="text-xl font-light text-gray-900">Email</h3>
              <p className="text-gray-600 font-light">
                <a href="mailto:contact@matiere-premiere.fr" className="hover:text-gray-900 transition">
                  contact@matiere-premiere.fr
                </a>
              </p>
            </div>

            {/* Phone */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-gray-900" />
                </div>
              </div>
              <h3 className="text-xl font-light text-gray-900">Téléphone</h3>
              <p className="text-gray-600 font-light">
                <a href="tel:+33123456789" className="hover:text-gray-900 transition">
                  +33 (0)1 23 45 67 89
                </a>
              </p>
            </div>

            {/* Address */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-gray-900" />
                </div>
              </div>
              <h3 className="text-xl font-light text-gray-900">Adresse</h3>
              <p className="text-gray-600 font-light">
                Entre Paris et Grasse<br />
                France
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">
              Envoyez-nous un Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">
                  Sujet
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="commande">Question sur une commande</option>
                  <option value="produit">Question sur un produit</option>
                  <option value="livraison">Livraison et retours</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition resize-none"
                  placeholder="Votre message..."
                />
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3"
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer le Message"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
