import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrdersByUser } from "@/lib/services/order-service";
import { getUserByEmail } from "@/lib/services/user-service";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Calendar, ChevronRight, Clock, MapPin } from "lucide-react";
import { getProduct } from "@/lib/services/product-service";
import Image from "next/image";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const user = await getUserByEmail(session.user.email);
  if (!user) {
    redirect("/login");
  }

  const orders = await getOrdersByUser(user.id);
  // Sort orders by date descending
  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Helper to get product details for display
  const getProductDetails = async (productId: string) => {
    return await getProduct(productId);
  };

  return (
    <div className="min-h-screen bg-brand-muted/30 py-40 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="font-display text-4xl font-black text-brand-primary mb-2">Riwayat Pesanan</h1>
        <p className="text-brand-primary/60 mb-10">Lacak perjalanan boneka dan rajutan custom Anda</p>

        <div className="space-y-6">
          {sortedOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-brand-primary/5">
               <div className="w-24 h-24 bg-brand-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-brand-primary/30" />
               </div>
               <h3 className="font-display text-xl font-bold text-brand-primary mb-2">Belum ada pesanan</h3>
               <p className="text-brand-primary/50 mb-8">Yuk mulai pesan rajutan custom impianmu!</p>
               <Link href="/products" className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-primary px-8 text-sm font-medium text-white transition-colors hover:bg-brand-secondary shadow-lg shadow-brand-primary/20">
                  Eksplorasi Produk
               </Link>
            </div>
          ) : (
            sortedOrders.map(async (order) => {
              // Get details of the first item to show as preview thumbnail
              const firstItem = order.items[0];
              const product = await getProductDetails(firstItem.productId);
              
              return (
                <Link key={order.id} href={`/history/${order.id}`} className="block group">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-brand-primary/5 group-hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Status & Date - Mobile top */}
                    <div className="md:hidden flex justify-between items-start">
                       <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                        <div className="flex items-center gap-2 text-xs font-bold text-brand-primary/40">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>

                    {/* Preview Image */}
                    <div className="w-full md:w-32 h-32 bg-brand-muted rounded-2xl overflow-hidden relative flex-shrink-0 border border-brand-primary/5">
                       {product?.image && product.image[0] ? (
                          <Image src={product.image[0]} alt={product.name} fill className="object-cover" />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center text-brand-primary/20">
                             <Package className="w-8 h-8" />
                          </div>
                       )}
                       {order.items.length > 1 && (
                         <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white text-[10px] py-1 text-center font-bold">
                           +{order.items.length - 1} lainnya
                         </div>
                       )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow flex flex-col justify-center">
                      <div className="hidden md:flex justify-between items-center mb-4">
                         <div className="flex items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                              order.status === 'delivered' ? 'bg-brand-accent/30 text-brand-primary' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-brand-secondary/20 text-brand-primary'
                            }`}>
                              {order.status === 'delivered' ? 'Selesai' : order.status}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-brand-primary/20" />
                            <div className="flex items-center gap-2 text-xs font-bold text-brand-primary/40">
                              <Calendar className="w-3 h-3" />
                              {new Date(order.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                         </div>
                         <span className="font-display text-lg font-black text-brand-primary">
                            Rp {order.total.toLocaleString("id-ID")}
                         </span>
                      </div>
                      
                      <h3 className="font-bold text-xl text-brand-primary mb-2 group-hover:text-brand-secondary transition-colors">
                        Order #{order.id.slice(0,8).toUpperCase()}
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center gap-2 text-sm text-brand-primary/60">
                           <MapPin className="w-4 h-4 text-brand-secondary" />
                           <span className="truncate max-w-[200px]">{order.shippingAddress?.address || "Alamat tidak tersedia"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-brand-primary/60 sm:justify-end">
                           <Clock className="w-4 h-4 text-brand-secondary" />
                           <span>Estimasi: 3-5 hari</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
