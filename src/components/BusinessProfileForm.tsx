import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Heading,
  useToast,
  Select,
  FormErrorMessage,
  Image,
  CloseButton,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { Business, Category, SubCategory, IsraelCity, IsraelStreet } from "../types/types";
import apiClient from "../services/api-client";
import { Timestamp } from "firebase/firestore";

interface BusinessProfileFormProps {
  initialData?: Business;
  onSubmit: (data: Business) => Promise<void>;
}

const BusinessProfileForm = ({ initialData, onSubmit }: BusinessProfileFormProps) => {
  const toast = useToast();
  const [business, setBusiness] = useState<Business>(
    initialData
      ? {
          ...initialData,
          address: {
            street: initialData.address?.street || "",
            city: initialData.address?.city || "",
            buildingNumber: initialData.address?.buildingNumber || "",
            state: initialData.address?.state || "",
            zipCode: initialData.address?.zipCode || "",
            country: initialData.address?.country || "",
          },
          contact: {
            phone: initialData.contact?.phone || "",
            email: initialData.contact?.email || "",
            website: initialData.contact?.website || "",
          },
        }
      : {
          name: "",
          description: "",
          mainCategoryId: "",
          subCategoryId: "",
          address: { street: "", city: "", buildingNumber: "", state: "", zipCode: "", country: "" },
          contact: { phone: "", email: "", website: "" },
          ownerId: "",
          ownerName: "",
          createdAt: Timestamp.fromDate(new Date()),
          updatedAt: Timestamp.fromDate(new Date()),
          status: "active",
          images: [],
          hoursOfOperation: {},
          yearsOfExperience: "",
          profileImageUrl: undefined,
        }
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(initialData?.profileImageUrl || null);

  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>(initialData?.images || []);

  // Israeli Address specific states
  const [israelCities, setIsraelCities] = useState<IsraelCity[]>([]);
  const [israelStreets, setIsraelStreets] = useState<IsraelStreet[]>([]);
  const [selectedCityCode, setSelectedCityCode] = useState<string>(initialData?.address?.city || '');
  const [selectedStreetName, setSelectedStreetName] = useState<string>(initialData?.address?.street || '');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get<Category[]>("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error fetching categories",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchCategories();
  }, [toast]);

  // Fetch Israeli Cities
  useEffect(() => {
    const fetchIsraelCities = async () => {
      try {
        const response = await apiClient.get('/israel-data/cities');
        if (response.data.result && response.data.result.records) {
          setIsraelCities(response.data.result.records.sort((a: IsraelCity, b: IsraelCity) => a.שם_ישוב.localeCompare(b.שם_ישוב))); // Sort by city name
        }
      } catch (error) {
        console.error("Error fetching Israeli cities:", error);
        toast({
          title: "Error fetching Israeli cities",
          description: (error as Error).message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchIsraelCities();
  }, [toast]);

  // Fetch Israeli Streets based on selected city
  useEffect(() => {
    if (selectedCityCode) {
      const fetchIsraelStreets = async () => {
        try {
          const response = await apiClient.get(`/israel-data/streets?cityCode=${selectedCityCode}`);
          if (response.data.result && response.data.result.records) {
            setIsraelStreets(response.data.result.records.sort((a: IsraelStreet, b: IsraelStreet) => a.שם_רחוב.localeCompare(b.שם_רחוב))); // Sort by street name
          }
        } catch (error) {
          console.error("Error fetching Israeli streets:", error);
          toast({
            title: "Error fetching Israeli streets",
            description: (error as Error).message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      };
      fetchIsraelStreets();
    } else {
      setIsraelStreets([]); // Clear streets if no city is selected
      setSelectedStreetName(''); // Clear selected street
    }
  }, [selectedCityCode, toast]);

  useEffect(() => {
    const selectedMainCategory = categories.find(cat => cat.id === business.mainCategoryId);
    if (selectedMainCategory && selectedMainCategory.subcategories) {
      setSubcategories(selectedMainCategory.subcategories);
    } else {
      setSubcategories([]);
    }
  }, [business.mainCategoryId, categories]);

  const validate = () => {
    const tempErrors: {[key: string]: string} = {};
    if (!business.name) tempErrors.name = "Business name is required.";
    if (!business.mainCategoryId) tempErrors.mainCategoryId = "Main category is required.";
    if (!selectedCityCode) tempErrors.city = "City is required.";
    if (!selectedStreetName) tempErrors.street = "Street is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBusiness(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => { const newErrors = { ...prev }; delete newErrors[name]; return newErrors; });
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusiness(prev => ({
      ...prev,
      contact: { ...prev.contact, [name]: value },
    }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityCode = e.target.value;
    setSelectedCityCode(cityCode);
    const cityName = israelCities.find(city => city.סמל_ישוב === cityCode)?.שם_ישוב || '';
    setBusiness(prev => ({
      ...prev,
      address: { ...prev.address, city: cityName, street: '' }, // Clear street when city changes
    }));
    setSelectedStreetName(''); // Clear selected street
  };

  const handleStreetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const streetName = e.target.value;
    setSelectedStreetName(streetName);
    setBusiness(prev => ({
      ...prev,
      address: { ...prev.address, street: streetName },
    }));
  };

  const handleBuildingNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBusiness(prev => ({
      ...prev,
      address: { ...prev.address, buildingNumber: value },
    }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveProfileImage = () => {
    setProfileImageFile(null);
    setProfileImagePreview(null);
    setBusiness(prev => ({ ...prev, profileImageUrl: undefined }));
  };

  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedGalleryFiles(prev => [...prev, ...filesArray]);

      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveNewGalleryImage = (index: number) => {
    const newFiles = selectedGalleryFiles.filter((_, i) => i !== index);
    const newPreviews = galleryPreviews.filter((_, i) => i !== index);
    setSelectedGalleryFiles(newFiles);
    setGalleryPreviews(newPreviews);
  };

  const handleRemoveExistingGalleryImage = (urlToRemove: string) => {
    setExistingGalleryUrls(prev => prev.filter(url => url !== urlToRemove));
  };

  const handleSubmitClick = async () => {
    if (!validate()) {
      toast({
        title: "Please correct the errors in the form.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await apiClient.post<{ url: string }>('/uploads/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data.url;
      };

      let finalProfileImageUrl = business.profileImageUrl;
      if (profileImageFile) {
        finalProfileImageUrl = await uploadImage(profileImageFile);
      }

      const uploadedGalleryUrls: string[] = [];
      for (const file of selectedGalleryFiles) {
        const url = await uploadImage(file);
        uploadedGalleryUrls.push(url);
      }

      const finalGalleryUrls = [...existingGalleryUrls, ...uploadedGalleryUrls];

      await onSubmit({ ...business, profileImageUrl: finalProfileImageUrl, images: finalGalleryUrls });
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: (error as Error).message || "An unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <FormControl id="name" isRequired isInvalid={!!errors.name}>
        <FormLabel>{"Business Name"}</FormLabel>
        <Input name="name" value={business.name} onChange={handleChange} />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>

      <FormControl id="description">
        <FormLabel>{"Description"}</FormLabel>
        <Textarea name="description" value={business.description} onChange={handleChange} />
      </FormControl>

      <HStack spacing={4}>
        <FormControl id="mainCategoryId" isRequired isInvalid={!!errors.mainCategoryId}>
          <FormLabel>{"Main Category"}</FormLabel>
          <Select name="mainCategoryId" value={business.mainCategoryId} onChange={handleChange}>
            <option value="">{"Select Main Category"}</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.mainCategoryId}</FormErrorMessage>
        </FormControl>

        <FormControl id="subCategoryId">
          <FormLabel>{"Subcategory"}</FormLabel>
          <Select name="subCategoryId" value={business.subCategoryId || ""} onChange={handleChange} isDisabled={subcategories.length === 0}>
            <option value="">{"Select Subcategory (Optional)"}</option>
            {subcategories.map(sub => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </Select>
        </FormControl>
      </HStack>

      <FormControl id="yearsOfExperience">
        <FormLabel>{"Years of Experience"}</FormLabel>
        <Input name="yearsOfExperience" value={business.yearsOfExperience} onChange={handleChange} />
      </FormControl>

      <Heading as="h2" size="md" mt={4}>{"Address"}</Heading>
      <FormControl id="city" isRequired isInvalid={!!errors.city}>
        <FormLabel>{"City"}</FormLabel>
        <Select name="city" value={selectedCityCode} onChange={handleCityChange}>
          <option value="">{"Select City"}</option>
          {israelCities.map((city) => (
            <option key={city.סמל_ישוב} value={city.סמל_ישוב}>
              {city.שם_ישוב}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.city}</FormErrorMessage>
      </FormControl>

      <FormControl id="street" isRequired isInvalid={!!errors.street}>
        <FormLabel>{"Street"}</FormLabel>
        <Select name="street" value={selectedStreetName} onChange={handleStreetChange} isDisabled={israelStreets.length === 0}>
          <option value="">{"Select Street"}</option>
          {israelStreets.map((street) => (
            <option key={street.סמל_רחוב} value={street.שם_רחוב}>
              {street.שם_רחוב}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.street}</FormErrorMessage>
      </FormControl>

      <FormControl id="buildingNumber">
        <FormLabel>{"Building Number"}</FormLabel>
        <Input name="buildingNumber" value={business.address.buildingNumber} onChange={handleBuildingNumberChange} />
      </FormControl>

      <Heading as="h2" size="md" mt={4}>{"Contact Information"}</Heading>
      <FormControl id="contactEmail">
        <FormLabel>{"Email"}</FormLabel>
        <Input name="email" value={business.contact.email} onChange={handleContactChange} />
      </FormControl>
      <FormControl id="contactPhone">
        <FormLabel>{"Phone"}</FormLabel>
        <Input name="phone" value={business.contact.phone} onChange={handleContactChange} />
      </FormControl>
      <FormControl id="contactWebsite">
        <FormLabel>{"Website"}</FormLabel>
        <Input name="website" value={business.contact.website} onChange={handleContactChange} />
      </FormControl>

      {/* Profile Image Upload Section */}
      <Heading as="h2" size="md" mt={4}>{"Profile Image"}</Heading>
      <FormControl id="profileImage">
        <FormLabel>{"Upload Profile Image"}</FormLabel>
        <Input type="file" accept="image/*" onChange={handleProfileImageChange} p={1} />
      </FormControl>
      {profileImagePreview && (
        <Box position="relative" borderWidth="1px" borderRadius="md" overflow="hidden" boxSize="150px">
          <Image src={profileImagePreview} alt={"Profile Preview"} objectFit="cover" boxSize="150px" />
          <CloseButton
            position="absolute"
            top="2"
            insetEnd="2"
            onClick={handleRemoveProfileImage}
            bg="whiteAlpha.700"
            _hover={{ bg: "whiteAlpha.900" }}
          />
        </Box>
      )}

      {/* Gallery Images Upload Section */}
      <Heading as="h2" size="md" mt={4}>{"Gallery Images"}</Heading>
      <FormControl id="galleryImages">
        <FormLabel>{"Upload Gallery Images"}</FormLabel>
        <Input type="file" multiple accept="image/*" onChange={handleGalleryImageChange} p={1} />
      </FormControl>

      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
        {existingGalleryUrls.map((url, index) => (
          <Box key={`existing-gallery-${index}`} position="relative" borderWidth="1px" borderRadius="md" overflow="hidden">
            <Image src={url} alt={"Gallery Image"} objectFit="cover" boxSize="150px" />
            <CloseButton
              position="absolute"
              top="2"
              insetEnd="2"
              onClick={() => handleRemoveExistingGalleryImage(url)}
              bg="whiteAlpha.700"
              _hover={{ bg: "whiteAlpha.900" }}
            />
          </Box>
        ))}
        {galleryPreviews.map((preview, index) => (
          <Box key={`new-gallery-${index}`} position="relative" borderWidth="1px" borderRadius="md" overflow="hidden">
            <Image src={preview} alt={"New Gallery Image"} objectFit="cover" boxSize="150px" />
            <CloseButton
              position="absolute"
              top="2"
              insetEnd="2"
              onClick={() => handleRemoveNewGalleryImage(index)}
              bg="whiteAlpha.700"
              _hover={{ bg: "whiteAlpha.900" }}
            />
          </Box>
        ))}
      </SimpleGrid>

      <Button colorScheme="teal" size="lg" onClick={handleSubmitClick} mt={8} isLoading={isSubmitting}>
        {"Save Business Profile"}
      </Button>
    </VStack>
  );
};

export default BusinessProfileForm;
