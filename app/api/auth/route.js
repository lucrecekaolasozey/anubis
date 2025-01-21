export default async function handler(req, res) {
    if (req.method === "POST") {
      const { walletAddress } = req.body;
  
      if (!walletAddress) {
        console.log("Authentication failed: Wallet address is missing.");
        return res.status(400).json({ error: "Wallet address is required" });
      }
  
      try {
        // Логика проверки или хранения пользователя
        console.log(`User authenticated successfully with wallet: ${walletAddress}`);
        
        // Возвращаем успешный статус
        return res.status(200).json({ message: "User authenticated successfully" });
      } catch (error) {
        console.error("Error during authentication:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      console.log(`Invalid method ${req.method} on /api/auth`);
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  