//src\app\_components\workouts\ClientSelector.tsx 
'use client';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';

interface ClientSelectorProps {
    clients: { id: string; name: string | null }[];
    field: ControllerRenderProps<any, 'clientIds'>;
}

export default function ClientSelector({ clients, field }: ClientSelectorProps) {
    return (
        <div className="grid grid-cols-2 gap-2">
            {clients.map(client => (
                <label key={client.id} className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        value={client.id}
                        checked={field.value.includes(client.id)}
                        onChange={(e) => {
                            if (e.target.checked) {
                                field.onChange([...field.value, client.id]);
                            } else {
                                field.onChange(field.value.filter((id: string) => id !== client.id));
                            }
                        }}
                        className="h-4 w-4"
                    />
                    {client.name}
                </label>
            ))}
        </div>
    );
}
