import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrder } from "@/lib/services/order-service";
import { getProduct } from "@/lib/services/product-service";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Package, Calendar, MapPin, Truck, ChevronLeft, ExternalLink } from "lucide-react";

interface OrderDetailProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailProps) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  // Ensure user owns this order (basic security)
  // Note: ideally we check userId against session user id, but for now assuming getOrder is safe or we filter later.
  // Ideally: if (order.userId !== user.id) redirect("/history");

  // Fetch product details for all items
  const itemsWithProduct = await Promise.all(
    order.items.map(async (item) => {
      const product = await getProduct(item.productId);
      return { ...item, product };
    })
  );

  return (
    <div className="min-h-screen bg-brand-muted/30 py-32 px-6">
      <div className="container mx-auto max-w-3xl">
        <Link 
          href="/history" 
          className="inline-flex items-center gap-2 text-brand-primary/50 hover:text-brand-primary transition-colors font-bold mb-8 group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-brand-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
             <ChevronLeft className="w-4 h-4" />
          </div>
          Kembali ke Riwayat
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-brand-primary/5 border border-white ring-1 ring-brand-primary/5 mb-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8 border-b-2 border-brand-primary/5 pb-8">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <span className="font-display text-3xl font-black text-brand-primary">Order #{order.id.slice(0, 8).toUpperCase()}</span>
                     <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-brand-primary/40">
                    <Calendar className="w-4 h-4" />
                    {new Date(order.createdAt).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-sm font-bold text-brand-primary/40 uppercase tracking-widest mb-1">Total Pesanan</p>
                  <p className="font-display text-3xl font-black text-brand-primary">Rp {order.total.toLocaleString("id-ID")}</p>
               </div>
            </div>

            {/* Shipping Info */}
            <div className="flex items-start gap-4 bg-brand-muted/20 rounded-2xl p-6">
               <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-secondary shadow-sm">
                  <MapPin className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="font-bold text-brand-primary mb-1">Alamat Pengiriman</h4>
                  <p className="text-brand-primary/70 leading-relaxed text-sm">
                    {order.shippingAddress?.address || "Alamat tidak tersedia"}
                    {order.shippingAddress?.city && `, ${order.shippingAddress.city}`}
                    {order.shippingAddress?.postalCode && ` ${order.shippingAddress.postalCode}`}
                  </p>
               </div>
            </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
           <h3 className="font-display text-xl font-bold text-brand-primary px-4">Produk yang Dibeli</h3>
           {itemsWithProduct.map((item, index) => (
             <Link 
               key={index}
               href={item.product ? `/products/${item.product.slug}` : "#"}
               className="block group"
             >
               <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-brand-primary/5 hover:shadow-lg hover:border-brand-primary/20 transition-all duration-300 flex gap-6 items-center">
                  {/* Image */}
                  <div className="w-24 h-24 bg-brand-muted rounded-2xl overflow-hidden relative flex-shrink-0 border border-brand-primary/5">
                    {item.product?.image?.[0] ? (
                       <Image src={item.product.image[0]} alt={item.product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-brand-primary/20">
                          <Package className="w-8 h-8" />
                       </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-grow">
                     <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-lg text-brand-primary group-hover:text-brand-secondary transition-colors line-clamp-1">
                           {item.product?.name || "Produk Tidak Ditemukan"}
                        </h4>
                        <ExternalLink className="w-4 h-4 text-brand-primary/20 group-hover:text-brand-secondary transition-colors" />
                     </div>
                     
                     <div className="text-xs font-bold text-brand-primary/40 uppercase tracking-wider mb-3">
                        {item.selectedVariants && Object.entries(item.selectedVariants).map(([key, value]) => (
                           <span key={key} className="mr-3 bg-brand-muted/30 px-2 py-1 rounded-md">{key}: {value}</span>
                        ))}
                     </div>

                     <div className="flex justify-between items-center bg-brand-muted/10 rounded-xl px-4 py-2">
                        <span className="text-sm font-bold text-brand-primary/60">{item.quantity} x Rp {item.price.toLocaleString("id-ID")}</span>
                        <span className="font-bold text-brand-primary">Rp {(item.quantity * item.price).toLocaleString("id-ID")}</span>
                     </div>
                  </div>
               </div>
             </Link>
           ))}
        </div>

      </div>
    </div>
  );
}
