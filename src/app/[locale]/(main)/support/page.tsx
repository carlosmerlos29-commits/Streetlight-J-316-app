
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SupportPage() {

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold">Centro de Soporte</h1>
        <p className="text-muted-foreground">Obtén ayuda o proporciona comentarios. ¡Estamos aquí para ti!</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contáctanos</CardTitle>
          <CardDescription>Por favor, completa el formulario a continuación y nos pondremos en contacto contigo lo antes posible.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" placeholder="Tu Nombre" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" type="email" placeholder="tu@email.com" />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Asunto</Label>
              <Select>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Selecciona un asunto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Reporte de Error</SelectItem>
                  <SelectItem value="feature">Solicitud de Característica</SelectItem>
                  <SelectItem value="question">Pregunta General</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea id="message" placeholder="Describe tu problema o solicitud..." className="min-h-[120px]" />
            </div>
            <Button type="submit" className="w-full">Enviar Ticket</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

    