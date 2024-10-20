"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Invoice } from './types/invoice';

interface SuccessResponse {
  success: true;
  data: Invoice;
}

interface ErrorResponse {
  success: false;
  message: string;
}

type Response = SuccessResponse | ErrorResponse;

const FileUpload = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const dropAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const getFilesArray = useCallback((origin: FileList | null) => {
    if (!origin) return []

    return Array.from(origin)
  }, [])

  const uploadFile = useCallback(async (file: File) => {
    const formData = new FormData()

    formData.append("invoice_file", file);

    const response = await fetch(process.env.NEXT_PUBLIC_SERVER_API_URL as string, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<Response>;
  }, [])

  const uploadFiles = useCallback(async (files: File[]) => {
    const results = await Promise.all(files.map(uploadFile));

    const invoices = results.filter(r => !!r.success).map(r => r.data as Invoice);

    setInvoices(prevInvoices => [...prevInvoices, ...invoices]);
  }, [uploadFile])


  const openFileInput = useCallback(() => {
    if (!inputRef.current) return;

    inputRef.current.click()
  }, [inputRef.current])

  const dropEventListener = useCallback((e: DragEvent) => {
    e.preventDefault();
    const files = getFilesArray(e.dataTransfer?.files || null)

    uploadFiles(files);
  }, [uploadFiles])

  const dragOverEventListener = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  useEffect(() => {
    if (!dropAreaRef.current) return () => { };

    dropAreaRef.current.addEventListener('dragover', dragOverEventListener);
    dropAreaRef.current.addEventListener('drop', dropEventListener);

    return () => {
      dropAreaRef.current?.removeEventListener('dragover', dragOverEventListener);
      dropAreaRef.current?.removeEventListener('drop', dropEventListener);
    }
  }, [dropAreaRef.current]);

  return (
    <div className="w-[60%] h-[80%] flex bg-[--foreground] justify-center items-center">
      <div
        ref={dropAreaRef}
        className='handle w-[100%] h-[90%] mx-[20px] flex flex-col justify-center items-center border-[--foreground] border-2 border-dashed bg-white shadow-md'
      >
        <div className='text-4xl my-[20px]'>
          Arraste sua fatura aqui
        </div>
        <span className='text-2xl'>OU</span>
        <button
          className='transition-colors text-xl my-[20px] p-3 rounded-3xl bg-[--foreground] text-white hover:bg-[--background] hover:text-[--foreground]'
          onClick={openFileInput}
        >
          Selecione-a diretamente
        </button>
        <input type='file' multiple ref={inputRef} className='hidden' onChange={e => {
          e.preventDefault();

          const files = getFilesArray(e.target.files);

          uploadFiles(files);
        }} />
      </div>

      <div
        className="w-[100%] h-[90%] pr-4 overflow-y-auto rounded-lg"
        id="invoices-list"
      >
        {invoices.map(invoice => (
          <div key={invoice.invoiceNumber} className="bg-white shadow-md p-4 rounded-lg mb-4">
            <h2 className="text-lg font-bold">{`Fatura Nº ${invoice.invoiceNumber}`}</h2>
            <p>Série: {invoice.invoiceSeries}</p>
            <p>Data de Vencimento: {invoice.invoiceBillingDate}</p>
            <p>Valor: R$ {invoice.invoiceValue}</p>
            <ul className="list-disc list-inside grid grid-cols-3 gap-x-4 gap-y-2">
              {Object.keys(invoice.energyConsumptionByMonths).map((month) => (
                <li key={month} className="flex flex-col justify-center py-2">
                  <span>{month}</span>
                  <ul className="list-disc ml-4">
                    <li>Total: {invoice.energyConsumptionByMonths[month].total}</li>
                    <li>Média: {invoice.energyConsumptionByMonths[month].average}</li>
                    <li>Período: {invoice.energyConsumptionByMonths[month].period}</li>
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
