<template>
    <div>
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">{{ isEditing ? 'Editar Produto' : 'Novo Produto' }}</h2>
            <router-link to="/painel-administrador/produtos"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar
            </router-link>
        </div>

        <form @submit.prevent="saveProduct">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Coluna Principal -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Informações Básicas -->
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>

                        <div class="space-y-4">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700">Nome do Produto
                                    *</label>
                                <input type="text" id="name" v-model="product.name" required
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>

                            <div>
                                <label for="description"
                                    class="block text-sm font-medium text-gray-700">Descrição</label>
                                <textarea id="description" v-model="product.description" rows="4"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="sku" class="block text-sm font-medium text-gray-700">SKU *</label>
                                    <input type="text" id="sku" v-model="product.sku" required
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>

                                <div>
                                    <label for="barcode" class="block text-sm font-medium text-gray-700">Código de
                                        Barras</label>
                                    <input type="text" id="barcode" v-model="product.barcode"
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Preços -->
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Preços</h3>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="price" class="block text-sm font-medium text-gray-700">Preço de Venda
                                    *</label>
                                <div class="mt-1 relative rounded-md shadow-sm">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span class="text-gray-500 sm:text-sm">R$</span>
                                    </div>
                                    <input type="number" id="price" v-model="product.price" required min="0" step="0.01"
                                        class="block w-full pl-10 pr-12 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                            </div>

                            <div>
                                <label for="compare_price" class="block text-sm font-medium text-gray-700">Preço
                                    Original</label>
                                <div class="mt-1 relative rounded-md shadow-sm">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span class="text-gray-500 sm:text-sm">R$</span>
                                    </div>
                                    <input type="number" id="compare_price" v-model="product.compare_price" min="0"
                                        step="0.01"
                                        class="block w-full pl-10 pr-12 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <p class="mt-1 text-xs text-gray-500">Deixe em branco se não houver preço promocional
                                </p>
                            </div>

                            <div>
                                <label for="cost" class="block text-sm font-medium text-gray-700">Custo</label>
                                <div class="mt-1 relative rounded-md shadow-sm">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span class="text-gray-500 sm:text-sm">R$</span>
                                    </div>
                                    <input type="number" id="cost" v-model="product.cost" min="0" step="0.01"
                                        class="block w-full pl-10 pr-12 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                            </div>

                            <div>
                                <label for="tax_class" class="block text-sm font-medium text-gray-700">Classe de
                                    Imposto</label>
                                <select id="tax_class" v-model="product.tax_class"
                                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                                    <option value="">Nenhum</option>
                                    <option value="standard">Padrão</option>
                                    <option value="reduced">Reduzido</option>
                                    <option value="zero">Isento</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Estoque -->
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Estoque</h3>

                        <div class="space-y-4">
                            <div class="flex items-center">
                                <input type="checkbox" id="track_inventory" v-model="product.track_inventory"
                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label for="track_inventory" class="ml-2 block text-sm text-gray-900">
                                    Controlar estoque deste produto
                                </label>
                            </div>

                            <div v-if="product.track_inventory" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="stock" class="block text-sm font-medium text-gray-700">Quantidade em
                                        Estoque</label>
                                    <input type="number" id="stock" v-model="product.stock" min="0"
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>

                                <div>
                                    <label for="low_stock_threshold"
                                        class="block text-sm font-medium text-gray-700">Alerta de Estoque Baixo</label>
                                    <input type="number" id="low_stock_threshold" v-model="product.low_stock_threshold"
                                        min="0"
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                            </div>

                            <div class="flex items-center">
                                <input type="checkbox" id="allow_backorders" v-model="product.allow_backorders"
                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label for="allow_backorders" class="ml-2 block text-sm text-gray-900">
                                    Permitir vendas quando não houver estoque
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Coluna Lateral -->
                <div class="space-y-6">
                    <!-- Imagens -->

                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Imagens</h3>

                        <div class="space-y-4">
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div v-for="(image, index) in product.images" :key="index"
                                    class="relative group border rounded-lg overflow-hidden">
                                    <img :src="image.url" :alt="product.name" class="w-full h-32 object-cover">
                                    <div
                                        class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button @click="removeImage(index)" type="button"
                                            class="p-1 bg-red-600 rounded-full text-white hover:bg-red-700 focus:outline-none">
                                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div v-if="index === 0"
                                        class="absolute top-0 left-0 bg-blue-600 text-white text-xs px-2 py-1">
                                        Principal
                                    </div>
                                </div>

                                <div class="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-32 cursor-pointer hover:border-blue-500"
                                    @click="openFileInput">
                                    <div class="text-center p-4">
                                        <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <p class="mt-1 text-xs text-gray-500">Adicionar imagem</p>
                                    </div>
                                </div>
                            </div>

                            <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" multiple
                                class="hidden" />

                            <p class="text-xs text-gray-500">
                                Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB.
                            </p>
                        </div>
                    </div>

                    <!-- Status e Visibilidade -->
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Status e Visibilidade</h3>

                        <div class="space-y-4">
                            <div>
                                <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                                <select id="status" v-model="product.status"
                                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                                    <option value="active">Ativo</option>
                                    <option value="draft">Rascunho</option>
                                    <option value="inactive">Inativo</option>
                                </select>
                            </div>

                            <div class="flex items-center">
                                <input type="checkbox" id="featured" v-model="product.featured"
                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label for="featured" class="ml-2 block text-sm text-gray-900">
                                    Produto em destaque
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Organização -->
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Organização</h3>

                        <div class="space-y-4">
                            <div>
                                <label for="category_id"
                                    class="block text-sm font-medium text-gray-700">Categoria</label>
                                <select id="category_id" v-model="product.category_id"
                                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                                    <option value="">Selecione uma categoria</option>
                                    <option v-for="category in categories" :key="category.id" :value="category.id">
                                        {{ category.name }}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label for="brand" class="block text-sm font-medium text-gray-700">Marca</label>
                                <select id="brand" v-model="product.brand_id"
                                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                                    <option value="">Selecione uma marca</option>
                                    <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                                        {{ brand.name }}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label for="tags" class="block text-sm font-medium text-gray-700">Tags</label>
                                <input type="text" id="tags" v-model="tagsInput" @keydown.enter.prevent="addTag"
                                    placeholder="Digite e pressione Enter"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />

                                <div class="mt-2 flex flex-wrap gap-2">
                                    <span v-for="(tag, index) in product.tags" :key="index"
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {{ tag }}
                                        <button @click="removeTag(index)" type="button"
                                            class="ml-1 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none">
                                            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Dimensões e Peso -->
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Dimensões e Peso</h3>

                        <div class="space-y-4">
                            <div class="grid grid-cols-3 gap-3">
                                <div>
                                    <label for="weight" class="block text-sm font-medium text-gray-700">Peso
                                        (kg)</label>
                                    <input type="number" id="weight" v-model="product.weight" min="0" step="0.01"
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>

                                <div>
                                    <label for="length" class="block text-sm font-medium text-gray-700">Comprimento
                                        (cm)</label>
                                    <input type="number" id="length" v-model="product.length" min="0" step="0.1"
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>

                                <div>
                                    <label for="width" class="block text-sm font-medium text-gray-700">Largura
                                        (cm)</label>
                                    <input type="number" id="width" v-model="product.width" min="0" step="0.1"
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>

                                <div>
                                    <label for="height" class="block text-sm font-medium text-gray-700">Altura
                                        (cm)</label>
                                    <input type="number" id="height" v-model="product.height" min="0" step="0.1"
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Botões de Ação -->
            <div class="mt-6 flex items-center justify-end space-x-3">
                <button type="button" @click="$router.push('/painel-administrador/produtos')"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Cancelar
                </button>
                <button type="submit" :disabled="loading"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    {{ isEditing ? 'Atualizar Produto' : 'Criar Produto' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'AdminProductForm',
    data() {
        return {
            product: {
                name: '',
                description: '',
                sku: '',
                barcode: '',
                price: '',
                compare_price: '',
                cost: '',
                tax_class: '',
                track_inventory: true,
                stock: 0,
                low_stock_threshold: 5,
                allow_backorders: false,
                status: 'active',
                featured: false,
                category_id: '',
                brand_id: '',
                tags: [],
                weight: '',
                length: '',
                width: '',
                height: '',               
                slug: '',
                images: []
            },
            tagsInput: '',
            loading: false
        };
    },
    computed: {
        ...mapState({
            categories: state => state.categories.items,
            brands: state => state.brands ? state.brands.items : []
        }),
        isEditing() {
            return !!this.$route.params.id;
        }
    },
    methods: {
        ...mapActions({
            fetchCategories: 'categories/fetchCategories',
            fetchBrands: 'brands/fetchBrands',
            createProduct: 'products/createProduct',
            updateProduct: 'products/updateProduct',
            fetchProduct: 'products/fetchProduct'
        }),
        async saveProduct() {
            this.loading = true;

            try {
                if (this.isEditing) {
                    await this.updateProduct({
                        id: this.$route.params.id,
                        data: this.product
                    });
                    this.$store.dispatch('notifications/add', {
                        type: 'success',
                        message: 'Produto atualizado com sucesso!'
                    });
                } else {
                    await this.createProduct(this.product);
                    this.$store.dispatch('notifications/add', {
                        type: 'success',
                        message: 'Produto criado com sucesso!'
                    });
                }

                this.$router.push('/admin/produtos');
            } catch (error) {
                this.$store.dispatch('notifications/add', {
                    type: 'error',
                    message: `Erro ao salvar produto: ${error.message}`
                });
            } finally {
                this.loading = false;
            }
        },
        addTag() {
            const tag = this.tagsInput.trim();
            if (tag && !this.product.tags.includes(tag)) {
                this.product.tags.push(tag);
            }
            this.tagsInput = '';
        },
        removeTag(index) {
            this.product.tags.splice(index, 1);
        },
        openFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileUpload() {
            //
        }
    }
}
</script>